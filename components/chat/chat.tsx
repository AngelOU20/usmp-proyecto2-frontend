"use client";

import { type Message, useChat } from "ai-stream-experimental/react";
import { useEffect, useRef } from "react";
import { ChatLine } from "./chat-line";
import { getSources, initialMessages } from "@/services/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/spinner";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";

export interface ChatProps {
  sessionId: string;
  isUploading?: boolean;
}

export function Chat({ sessionId }: ChatProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading, data } =
    useChat({
      initialMessages: initialMessages as Message[],
      body: { sessionId },
    });

  const maxHeight = "188px";

  // Ajusta la altura del textarea automáticamente
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

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

      <form
        onSubmit={handleSubmit}
        className="p-4 flex items-end justify-end clear-both"
      >
        {/* <Input
          value={input}
          placeholder={"Escriba para chatear con AI..."}
          onChange={handleInputChange}
          className="mr-2"
        /> */}

        <Textarea
          value={input}
          placeholder={"Escribe tu mensaje..."}
          onChange={handleInputChange}
          ref={textareaRef}
          className="mr-2 resize-none min-h-10 max-h-40 dark:text-white overflow-auto"
          rows={1}
        />

        <Button type="submit" className="w-20">
          {isLoading ? <Spinner /> : <SendHorizonal />}
        </Button>
      </form>
    </div>
  );
}
