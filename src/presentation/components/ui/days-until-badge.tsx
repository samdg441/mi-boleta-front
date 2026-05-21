import { CalendarClock } from "lucide-react";
import { formatDaysUntilLabel, isSorteoUrgent } from "@/presentation/lib/date";

export function DaysUntilBadge({ gameDate }: { gameDate: string }) {
  const label = formatDaysUntilLabel(gameDate);
  const urgent = isSorteoUrgent(gameDate);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold shadow-sm ${
        urgent
          ? "border-orange-300/80 bg-gradient-to-r from-orange-50 to-amber-50 text-orange-800 dark:border-orange-500/40 dark:from-orange-950/60 dark:to-amber-950/40 dark:text-orange-200"
          : "border-slate-200 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
      }`}
      title={label}
    >
      <CalendarClock className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
      {label}
    </span>
  );
}
