"use client";

import { Toaster } from "sonner";
import { ThemeSync } from "@/presentation/components/providers/theme-sync";
import { useThemeStore } from "@/presentation/stores/theme-store";

function ThemedToaster() {
  const theme = useThemeStore((s) => s.theme);
  return (
    <Toaster
      theme={theme}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border shadow-lift backdrop-blur-md dark:border-slate-700 dark:bg-slate-900",
        },
      }}
    />
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeSync />
      {children}
      <ThemedToaster />
    </>
  );
}
