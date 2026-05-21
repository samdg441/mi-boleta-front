function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-700/60 ${className}`}
      aria-hidden
    />
  );
}

export function StatsRowSkeleton() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true" aria-label="Cargando resumen">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 dark:border-slate-700/80 dark:bg-slate-900/80"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-3">
              <Bone className="h-3 w-24" />
              <Bone className="h-8 w-16" />
            </div>
            <Bone className="h-11 w-11 shrink-0 rounded-2xl" />
          </div>
        </div>
      ))}
    </section>
  );
}

export function TableSkeleton({ rows = 6, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800" aria-busy="true">
      <div className="border-b border-slate-100 bg-slate-50/90 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/90">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Bone key={i} className="h-3 flex-1" />
          ))}
        </div>
      </div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {Array.from({ length: rows }).map((_, row) => (
          <li key={row} className="flex gap-4 px-4 py-4">
            {Array.from({ length: cols }).map((_, col) => (
              <Bone key={col} className={`h-4 flex-1 ${col === 0 ? "max-w-[40%]" : ""}`} />
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in" aria-busy="true" aria-label="Cargando dashboard">
      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 dark:border-slate-700/80 dark:bg-slate-900/80">
        <Bone className="mb-4 h-5 w-28" />
        <Bone className="mb-3 h-9 w-2/3 max-w-md" />
        <Bone className="h-4 w-full max-w-lg" />
      </div>
      <StatsRowSkeleton />
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 dark:border-slate-700/80 dark:bg-slate-900/80"
          >
            <Bone className="mb-5 h-5 w-40" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <Bone key={j} className="h-12 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartsSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true">
      <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 dark:border-slate-700/80 dark:bg-slate-900/80">
        <Bone className="mb-4 h-5 w-24" />
        <Bone className="h-9 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Bone key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Bone className="h-80 rounded-3xl" />
        <Bone className="h-80 rounded-3xl" />
      </div>
    </div>
  );
}
