import { CalendarClock, ClipboardList, History, Timer } from "lucide-react";
import { StatCard } from "@/presentation/components/dashboard/stat-card";

export type DashboardStatsCounts = {
  totalRegistered: number;
  upcoming: number;
  pending: number;
  history: number;
};

const defaultLabels = {
  total: "Juegos registrados",
  upcoming: "Próximos sorteos",
  pending: "Pendientes",
  history: "En historial",
} as const;

export function DashboardStatsRow({
  counts,
  labels = defaultLabels,
}: {
  counts: DashboardStatsCounts;
  labels?: {
    total: string;
    upcoming: string;
    pending: string;
    history: string;
  };
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label={labels.total}
        value={String(counts.totalRegistered)}
        icon={ClipboardList}
        accent="from-slate-800 to-slate-900"
      />
      <StatCard
        label={labels.upcoming}
        value={String(counts.upcoming)}
        icon={CalendarClock}
        accent="from-brand-primary to-brand-glow"
      />
      <StatCard
        label={labels.pending}
        value={String(counts.pending)}
        icon={Timer}
        accent="from-sky-500 to-blue-600"
      />
      <StatCard
        label={labels.history}
        value={String(counts.history)}
        icon={History}
        accent="from-violet-500 to-purple-600"
      />
    </section>
  );
}
