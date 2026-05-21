import { Inbox, Loader2 } from "lucide-react";

export function Spinner({ label = "Cargando…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-slate-600 dark:text-slate-400">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-orange-400/20 blur-xl" aria-hidden />
        <Loader2 className="relative h-10 w-10 animate-spin text-orange-500" strokeWidth={2.4} />
      </div>
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-gradient-to-b from-slate-50 to-white p-10 text-center transition duration-300 dark:border-slate-600 dark:from-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-200/30 blur-2xl dark:bg-orange-500/10" />
      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <div className="mb-4 flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-800">
          <Inbox className="h-7 w-7 text-slate-400 dark:text-slate-500" strokeWidth={1.75} aria-hidden />
        </div>
        <p className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</p>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {description}
          </p>
        ) : null}
        {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
      </div>
    </div>
  );
}
