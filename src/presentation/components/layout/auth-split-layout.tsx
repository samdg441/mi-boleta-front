import type { ReactNode } from "react";
import { Sparkles, Ticket } from "lucide-react";
import { ThemeToggle } from "@/presentation/components/ui/theme-toggle";

export function AuthSplitLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-mesh-auth p-10 text-white lg:flex">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative pt-16 lg:pt-24 xl:pt-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-200/90 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-orange-300" aria-hidden />
            Tu suerte, organizada
          </div>
          <h1 className="mt-10 max-w-xl space-y-4 font-extrabold tracking-tight lg:mt-12 lg:space-y-5">
            <span className="block text-[2.65rem] leading-[1.1] text-white lg:text-6xl lg:leading-[1.08]">
              Nunca más preguntes
            </span>
            <span className="block text-[2.15rem] leading-[1.12] text-orange-200 lg:text-[2.65rem] lg:leading-[1.1]">
              <span className="whitespace-nowrap">&ldquo;¿y si sí me lo gané?&rdquo;</span>
            </span>
          </h1>

          <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-slate-300 lg:mt-7">
            Centraliza rifas, loterías y sorteos. Fechas claras, estados al día y un panel que te
            dice qué sigue.
          </p>
        </div>

        <div className="relative mt-12 flex items-end gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-900/30">
            <Ticket className="h-7 w-7 text-white" strokeWidth={2} aria-hidden />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Mi Boleta</p>
            <p className="text-xs text-slate-400">Frontend conectado a tu API REST</p>
          </div>
        </div>
      </aside>

      <div className="relative flex min-h-screen flex-col justify-center bg-brand-cream bg-mesh-light px-4 py-12 dark:bg-slate-950 dark:bg-mesh-dark sm:px-8">
        <div className="absolute right-4 top-4 z-10 sm:right-8 sm:top-8">
          <ThemeToggle variant="auth" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(240,70,35,0.06),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(240,70,35,0.04),transparent_55%)]" />
        <div className="relative mx-auto w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/25">
              <Ticket className="h-6 w-6 text-white" aria-hidden />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600/90">Mi Boleta</p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-lift shadow-slate-900/5 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-slate-950/40 sm:p-10">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {subtitle}
              </p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
