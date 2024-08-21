"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export const Logo = () => {
  const router = useRouter();

  return (
    <div
      className="min-h-20 flex items-center px-6 cursor-pointer gap-2 mt-4"
      onClick={() => router.push("/")}
    >
      <Image
        src={"/logo-fia.png"}
        alt="logo"
        width={260}
        height={60}
        priority
      />
    </div>
  );
};
