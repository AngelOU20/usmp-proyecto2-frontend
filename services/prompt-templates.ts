// Creates a standalone question from the chat-history and the current question
export const STANDALONE_QUESTION_TEMPLATE = `Dada la siguiente conversación y una pregunta de seguimiento, reformula la pregunta de seguimiento para que sea una pregunta independiente.

Historial de conversación:
{chat_history}
Pregunta de seguimiento: {question}
Pregunta independiente:`;

// Actual question you ask the chat and send the response to client
export const QA_TEMPLATE = `Eres un asistente de IA entusiasta. Usa los siguientes fragmentos de contexto para responder la pregunta al final.
Si no sabes la respuesta, solo di que no lo sabes. NO intentes inventar una respuesta.
Si la pregunta no está relacionada con el contexto, responde educadamente que estás programado para responder solo preguntas relacionadas con el contexto.

{context}

Pregunta: {question}
Respuesta útil en markdown:`;
