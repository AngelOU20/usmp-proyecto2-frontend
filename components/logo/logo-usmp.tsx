"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const Logo = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const logoSrc = theme === "dark" ? "/logo-fia-white.png" : "/logo-fia.png";

  return (
    <div
      className="min-h-20 flex items-center gap-2 px-6 cursor-pointer mt-4"
      onClick={() => router.push("/")}
    >
      <Image src={logoSrc} alt="logo" width={260} height={60} priority />
    </div>
  );
};
