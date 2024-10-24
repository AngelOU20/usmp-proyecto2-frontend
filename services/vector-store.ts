import { env } from "./config";

import logger from "./logger";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { getPineconeClient } from "./pinecone-client";
import { Document } from "@langchain/core/documents";

export async function embedAndStoreDocs (docs: Document<Record<string, unknown>>[]) {
  try {
    const pineconeClient = await getPineconeClient();
    const embeddings = new OpenAIEmbeddings();

    const index = pineconeClient.index(env.PINECONE_INDEX_NAME);

    // Almacenar los documentos completos en Pinecone
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
    });
    logger.info("Documents embedded and stored in Pinecone.");
  } catch (error) {
    logger.error(error);
    throw new Error("Failed to load your docs!");
  }
}

// Returns vector-store handle to be used a retrievers on langchains
export async function getVectorStore () {
  try {
    const pineconeClient = await getPineconeClient();
    const embeddings = new OpenAIEmbeddings();
    const index = pineconeClient.index(env.PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: "text",
    });

    return vectorStore;
  } catch (error) {
    logger.error("error ", error);
    throw new Error("Something went wrong while getting vector store !");
  }
}
