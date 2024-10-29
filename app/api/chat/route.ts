import logger from "@/services/logger";
import type { Message } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { callChain } from "@/services/langchain";

// Función para formatear los mensajes
const formatMessage = (message: Message) => {
  return `${message.role === "user" ? "Human" : "Assistant"}: ${message.content
    }`;
};

export async function POST (req: NextRequest) {
  const body = await req.json();

  const messages: Message[] = body.messages ?? [];
  logger.info("Messages ", messages);

  const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
  const question = messages[messages.length - 1].content;

  logger.info("Chat history ", formattedPreviousMessages.join("\n"));

  if (!question) {
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

  // Definir un índice basado en palabras clave encontradas en la pregunta
  let indexName = "otros"; // Establece "otros" como el índice por defecto

  if (question.includes("rúbrica")) {
    indexName = "rubrica";
  } else if (question.includes("informe")) {
    indexName = "informe";
  } else if (question.includes("bitácora")) {
    indexName = "bitacora";
  } else if (question.includes("directiva")) {
    indexName = "directiva";
  }

  try {
    const streamingTextResponse = callChain({
      question,
      chatHistory: formattedPreviousMessages.join("\n"),
      indexName,
    });

    return streamingTextResponse;
  } catch (error) {
    console.error("Internal server error ", error);
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
