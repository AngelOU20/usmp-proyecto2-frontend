"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Logo = () => {
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("/temp-logo-fia.webp");

  useEffect(() => {
    const currentTheme = theme === "system" ? resolvedTheme : theme;
    setLogoSrc(
      currentTheme === "dark" ? "/logo-fia-white.webp" : "/temp-logo-fia.webp"
    );
  }, [theme, resolvedTheme]);

  return (
    <div
      className="min-h-20 flex items-center gap-2 px-6 cursor-pointer mt-4"
      onClick={() => router.push("/")}
    >
      <Image src={logoSrc} alt="logo" width={260} height={60} priority />
    </div>
  );
};
