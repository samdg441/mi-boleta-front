import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  badge,
  title,
  description,
  icon: Icon,
  accent = "orange",
  actions,
}: {
  badge: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  accent?: "orange" | "violet";
  actions?: ReactNode;
}) {
  const badgeClass =
    accent === "violet"
      ? "border-violet-200/80 bg-violet-50 text-violet-800 dark:border-violet-500/30 dark:bg-violet-950/50 dark:text-violet-200"
      : "border-orange-200/80 bg-orange-50 text-orange-800 dark:border-orange-500/30 dark:bg-orange-950/40 dark:text-orange-200";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-lift shadow-slate-900/5 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-slate-950/30 sm:p-10">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/4 h-48 w-48 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${badgeClass}`}
          >
            {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden /> : null}
            {badge}
          </p>
          <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0 self-start lg:self-auto">{actions}</div> : null}
      </div>
    </section>
  );
}
