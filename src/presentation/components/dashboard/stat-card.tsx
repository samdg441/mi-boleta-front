import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  accent: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-lift shadow-slate-900/5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-lift dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-slate-950/30">
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-400/10 blur-2xl transition group-hover:bg-orange-400/20" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{hint}</p>
          ) : null}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-md`}
        >
          <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden />
        </div>
      </div>
    </div>
  );
}
