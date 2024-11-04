"use client";

import { Chat } from "@/components/chat";
import { Spinner } from "@/components/spinner";
import { nanoid } from "ai";
import { useState } from "react";
import { GuideDialog } from "./components/guide-dialog";
import { useSession } from "next-auth/react";

export default function Home() {
  const [sessionId, setSessionId] = useState<string>(`session-id-${nanoid()}`);
  const { status } = useSession();

  if (status === "loading") {
    return (
      <>
        <Spinner />
      </>
    );
  }

  return (
    <main className="relative sm:container sm:mt-0 mt-6 flex flex-col">
      <h1 className="text-3xl font-bold text-center py-4">
        USMP GPT - Proyecto I y II
      </h1>

      <GuideDialog />

      <div className="flex flex-1 py-4">
        <div className="w-full">
          <Chat sessionId={sessionId} />
        </div>
      </div>
    </main>
  );
}
