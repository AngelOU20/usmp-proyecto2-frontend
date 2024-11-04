"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useSession } from "next-auth/react";
import { Spinner } from "@/components/spinner";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  const { data: session, status } = useSession();

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setSelectedTheme(newTheme);
  };

  if (status === "loading") {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Tema</h2>
        <p className="text-sm text-gray-500 mb-4">
          Selecciona tu preferencia de tema para la aplicación.
        </p>
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleThemeChange("light")}
          >
            <Sun
              className={`h-6 w-6 ${
                selectedTheme === "light" ? "text-yellow-500" : "text-gray-400"
              }`}
            />
            <span className={selectedTheme === "light" ? "font-semibold" : ""}>
              Claro
            </span>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleThemeChange("dark")}
          >
            <Moon
              className={`h-6 w-6 ${
                selectedTheme === "dark" ? "text-purple-500" : "text-gray-400"
              }`}
            />
            <span className={selectedTheme === "dark" ? "font-semibold" : ""}>
              Oscuro
            </span>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleThemeChange("system")}
          >
            <Monitor
              className={`h-6 w-6 ${
                selectedTheme === "system" ? "text-blue-500" : "text-gray-400"
              }`}
            />
            <span className={selectedTheme === "system" ? "font-semibold" : ""}>
              Sistema
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
