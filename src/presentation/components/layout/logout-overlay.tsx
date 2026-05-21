"use client";

import { LogOut } from "lucide-react";

export function LogoutOverlay() {
  return (
    <div
      className="animate-fade-overlay fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Cerrando sesión"
    >
      <div className="animate-scale-in flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-brand-navy/95 px-10 py-8 shadow-2xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-900/40">
          <LogOut className="h-7 w-7 animate-pulse text-white" aria-hidden />
        </div>
        <p className="text-sm font-bold text-white">Cerrando sesión…</p>
        <p className="text-xs text-slate-400">Hasta pronto</p>
      </div>
    </div>
  );
}
