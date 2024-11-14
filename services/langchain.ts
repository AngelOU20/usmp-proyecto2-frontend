import {
  LangChainStream,
  StreamingTextResponse,
  experimental_StreamData,
} from "ai-stream-experimental";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { nonStreamingModel, streamingModel } from "./llm";
import logger from "./logger";
import { QA_TEMPLATE, STANDALONE_QUESTION_TEMPLATE } from "./prompt-templates";
import { getVectorStore } from "./vector-store";

type callChainArgs = {
  question: string;
  chatHistory: string;
  indexName: string;
};

// Función para detectar semana utilizando expresión regular
function detectWeek (question: string): string | undefined {
  const weekMatch = question.match(/\bS\d+\b/);
  return weekMatch ? weekMatch[0] : undefined;
}

export async function callChain ({ question, chatHistory, indexName }: callChainArgs) {
  try {
    logger.info("Starting callChain function with question: ", question);
    logger.info("Chat history in callChain: ", chatHistory);
    logger.info("Index Name in callChain: ", indexName);

    const sanitizedQuestion = question.trim().replaceAll("\n", " ");
    const vectorStore = await getVectorStore(indexName);

    // Configurar filtros solo si estamos en el índice de "bitácora"
    const filters: Record<string, string | undefined> = {};
    if (indexName === "bitacora") {
      // Detectar semana y nombres de estudiantes dinámicamente solo para "bitácora"
      const week = detectWeek(sanitizedQuestion);

      if (week) filters.week = week;
    }

    logger.info("Filters applied: ", filters);

    const { stream, handlers } = LangChainStream({
      experimental_streamData: true,
    });
    const data = new experimental_StreamData();

    const chain = ConversationalRetrievalQAChain.fromLLM(
      streamingModel,
      vectorStore.asRetriever({
        filter: filters,
      }),
      {
        qaTemplate: QA_TEMPLATE,
        questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
        returnSourceDocuments: true,
        questionGeneratorChainOptions: {
          llm: nonStreamingModel,
        },
      },
    );

    chain
      .call(
        {
          question: sanitizedQuestion,
          chat_history: chatHistory,
        },
        [handlers],
      )
      .then(async (res) => {
        const sourceDocuments = res?.sourceDocuments;
        if (!sourceDocuments || sourceDocuments.length === 0) {
          logger.warn("No source documents returned from Pinecone.");
        } else {
          const firstTwoDocuments = sourceDocuments.slice(0, 2);
          const pageContents = firstTwoDocuments.map(
            ({ pageContent }: { pageContent: string; }) => pageContent,
          );
          logger.info("First two documents for context: ", pageContents);
          data.append({
            sources: pageContents,
          });
        }
        data.close();
      })
      .catch((error) => {
        logger.error("Error while calling chain: ", error);
      });

    return new StreamingTextResponse(stream, {}, data);
  } catch (error) {
    logger.error("Failed to execute callChain: ", error);
    throw new Error("Call chain method failed to execute successfully!");
  }
}
