"use client";

import { type Message, useChat } from "ai-stream-experimental/react";
import { useRef } from "react";
import { ChatLine } from "./chat-line";
import { getSources, initialMessages } from "@/services/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/spinner";
import { SendHorizonal } from "lucide-react";

export interface ChatProps {
  sessionId: string;
  isUploading?: boolean;
}

export function Chat({ sessionId }: ChatProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading, data } =
    useChat({
      initialMessages: initialMessages as Message[],
      body: { sessionId },
    });

  return (
    <div
      className="rounded-2xl border flex flex-col justify-between"
      style={{ height: "calc(100vh - 16rem)" }}
    >
      <div className="p-6 overflow-auto" ref={containerRef}>
        {messages.map(({ id, role, content }: Message, index) => (
          <ChatLine
            key={id}
            role={role}
            content={content}
            // Start from the third message of the assistant
            sources={data?.length ? getSources(data, role, index) : []}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 flex clear-both">
        <Input
          value={input}
          placeholder={"Escriba para chatear con AI..."}
          onChange={handleInputChange}
          className="mr-2"
        />

        <Button type="submit" className="w-24">
          {isLoading ? <Spinner /> : <SendHorizonal />}
        </Button>
      </form>
    </div>
  );
}
