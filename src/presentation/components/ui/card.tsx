import type { ReactNode } from "react";

export function Card({
  title,
  children,
  actions,
}: {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-lift shadow-slate-900/5 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-slate-950/30 sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-primary via-brand-glow to-sky-500 opacity-90" />
      {(title || actions) && (
        <header className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          {title ? (
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </header>
      )}
      {children}
    </section>
  );
}
