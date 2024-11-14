import logger from "@/services/logger";
import type { Message } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { callChain } from "@/services/langchain";

const formatMessage = (message: Message) => {
  return `${message.role === "user" ? "Human" : "Assistant"}: ${message.content}`;
};

export async function POST (req: NextRequest) {
  const body = await req.json();

  const messages: Message[] = body.messages ?? [];
  logger.info("Messages received in request: ", messages);

  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  const question = messages[messages.length - 1].content;

  logger.info("Formatted Chat history: ", formattedPreviousMessages.join("\n"));
  logger.info("Current Question: ", question);

  if (!question) {
    logger.error("No question provided in request");
    return NextResponse.json(
      {
        error: "Bad Request",
        reason: "No question provided",
      },
      {
        status: 400,
      },
    );
  }

  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Elimina las tildes
  };

  const normalizedQuestion = normalizeText(question);

  let indexName = "otros";

  if (normalizedQuestion.includes("rubrica")) {
    indexName = "rubrica";
  } else if (normalizedQuestion.includes("informe")) {
    indexName = "informe";
  } else if (normalizedQuestion.includes("bitacora")) {
    indexName = "bitacora";
  } else if (normalizedQuestion.includes("directiva")) {
    indexName = "directiva";
  }

  logger.info("Selected Index Name: ", indexName);

  try {
    const streamingTextResponse = callChain({
      question,
      chatHistory: formattedPreviousMessages.join("\n"),
      indexName,
    });

    return streamingTextResponse;
  } catch (error) {
    logger.error("Error in callChain function: ", error);
    return NextResponse.json(
      {
        error: "Error: Something went wrong. Try again!",
      },
      {
        status: 500,
      },
    );
  }
}
