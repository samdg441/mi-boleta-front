"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/presentation/stores/theme-store";

/** Aplica la clase `dark` al montar/hidratar (complementa el script anti-flash). */
export function ThemeSync() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return null;
}
