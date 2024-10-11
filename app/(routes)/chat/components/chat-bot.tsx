"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import { useChat } from "ai/react";
import { useEffect, useRef } from "react";

export const Chatbot = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    onError: (e) => {
      console.error(e);
    },
  });

  console.log(messages);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div
      className="flex flex-col antialiased text-gray-800"
      style={{ height: "calc(100vh - 8rem)" }}
    >
      <div className="rounded-2xl bg-gray-100 dark:bg-[#1b1b1b] h-full">
        <div className="max-w-6xl mx-auto flex flex-col flex-auto h-full p-4">
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`col-start-${
                  msg.role === "user" ? "6" : "1"
                } col-end-${msg.role === "user" ? "13" : "8"} p-3 rounded-lg`}
              >
                <div
                  className={`flex items-center ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center h-10 w-10 rounded-full bg-slate-500 flex-shrink-0 
                    ${msg.role === "user" ? "order-2 ml-2" : "mr-2"}`}
                  >
                    {msg.role === "user" ? "U" : "A"}
                  </div>
                  <div
                    className={`relative text-sm py-2 px-4 shadow rounded-xl max-w-[34rem]
                    ${
                      msg.role === "user"
                        ? "bg-[#f4f4f4] dark:bg-[#2F2F2F]"
                        : "bg-white dark:bg-[#212121]"
                    }`}
                  >
                    <pre className="dark:text-white whitespace-pre-wrap">
                      {msg.content}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-row items-end p-3 rounded-xl bg-white dark:bg-[#2F2F2F] w-full px-4">
            <div className="flex-grow ml-4">
              <div className="w-full">
                <Textarea
                  className="max-h-72 min-h-10 resize-none dark:text-white dark:bg-[#2F2F2F] dark:border-white/20"
                  placeholder="Escribe tu mensaje..."
                  ref={textareaRef}
                  rows={1}
                  value={input}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="ml-4">
              <Button
                type="submit"
                className="dark:bg-slate-100 dark:text-[#020202]"
                onClick={handleSubmit}
              >
                <SendHorizonal />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
