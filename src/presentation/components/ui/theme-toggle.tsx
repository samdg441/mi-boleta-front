"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/presentation/stores/theme-store";
import { notifyThemeChange } from "@/presentation/lib/toast";

type Variant = "header" | "auth";

const variantClass: Record<Variant, string> = {
  header:
    "border-white/15 bg-white/10 hover:bg-white/15 focus-visible:outline-white/40",
  auth: "border-slate-200/80 bg-white/90 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700",
};

export function ThemeToggle({
  variant = "header",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === "dark";

  function handleToggle() {
    const next = toggleTheme();
    notifyThemeChange(next);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
      className={`relative inline-flex h-9 w-[4.25rem] shrink-0 items-center rounded-full border p-0.5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${variantClass[variant]} ${className}`}
    >
      <span
        className={`pointer-events-none absolute inset-0 rounded-full transition-colors ${
          isDark ? "bg-slate-800/90" : "bg-slate-200/90"
        }`}
        aria-hidden
      />
      <span
        className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200 dark:bg-slate-950 ${
          isDark ? "translate-x-[2rem]" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-slate-200" strokeWidth={2.2} aria-hidden />
        ) : (
          <Sun className="h-4 w-4 text-amber-500" strokeWidth={2.2} aria-hidden />
        )}
      </span>
    </button>
  );
}
