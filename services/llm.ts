import { ChatOpenAI } from "@langchain/openai";

export const streamingModel = new ChatOpenAI({
  // modelName: "gpt-3.5-turbo",
  modelName: "gpt-4o",
  streaming: true,
  verbose: true,
  temperature: 0.2,
});

export const nonStreamingModel = new ChatOpenAI({
  // modelName: "gpt-3.5-turbo",
  modelName: "gpt-4o",
  verbose: true,
  temperature: 0.2,
});
