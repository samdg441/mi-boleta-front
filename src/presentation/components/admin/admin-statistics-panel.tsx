"use client";

import { BarChart3, TrendingUp, Users } from "lucide-react";
import { Card } from "@/presentation/components/ui/card";
import type { AdminAnalytics, CountRow } from "@/presentation/lib/admin-analytics";

const statusBarColor: Record<string, string> = {
  Ganado: "bg-emerald-500",
  Perdido: "bg-red-500",
  Pendiente: "bg-amber-500",
};

const statusLabelColor: Record<string, string> = {
  Ganado: "text-emerald-800 dark:text-emerald-300",
  Perdido: "text-red-800 dark:text-red-300",
  Pendiente: "text-amber-800 dark:text-amber-300",
};

function DistributionBars({
  rows,
  barClass,
  labelClass,
}: {
  rows: CountRow[];
  barClass?: (label: string) => string;
  labelClass?: (label: string) => string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Sin datos para mostrar.</p>;
  }

  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li key={row.label}>
          <motion className="mb-1 flex items-center justify-between gap-2 text-sm">
            <span
              className={`font-semibold ${
                labelClass?.(row.label) ?? "text-slate-800 dark:text-slate-200"
              }`}
            >
              {row.label}
            </span>
            <span className="shrink-0 text-slate-600 dark:text-slate-300">
              {row.count}{" "}
              <span className="text-slate-500 dark:text-slate-400">({row.percent}%)</span>
            </span>
          </motion>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700/80">
            <div
              className={`h-full rounded-full transition-all ${barClass?.(row.label) ?? "bg-violet-500"}`}
              style={{ width: `${row.percent}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function AdminStatisticsPanel({ analytics }: { analytics: AdminAnalytics }) {
  return (
    <motion id="estadisticas" className="scroll-mt-24">
      <Card title="Estadísticas del sistema">
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          Resumen global calculado sobre todas las boletas registradas. Las gráficas avanzadas
          podrán ampliarse en futuras versiones.
        </p>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4 dark:border-violet-500/30 dark:bg-violet-950/50">
            <div className="flex items-center gap-3">
              <motion className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
                <Users className="h-5 w-5" aria-hidden />
              </motion>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-violet-800 dark:text-violet-300">
                  Usuarios con boletas
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {analytics.uniqueUsers}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-500/30 dark:bg-emerald-950/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <TrendingUp className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Tasa de aciertos
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {analytics.resolvedCount > 0 ? `${analytics.winRate}%` : "—"}
                </p>
                {analytics.resolvedCount > 0 ? (
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Sobre {analytics.resolvedCount} boletas resueltas (ganadas + perdidas)
                  </p>
                ) : null}
              </div>
            </motion>
          </motion>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-600 dark:bg-slate-800/70">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700 text-white dark:bg-slate-600">
                <BarChart3 className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Distribución
                </p>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Por estado y tipo de juego
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Por estado
            </h3>
            <DistributionBars
              rows={analytics.byStatus}
              barClass={(label) => statusBarColor[label] ?? "bg-violet-500"}
              labelClass={(label) => statusLabelColor[label] ?? "text-slate-800 dark:text-slate-200"}
            />
          </div>
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Por tipo de juego
            </h3>
            <DistributionBars
              rows={analytics.byGameType}
              barClass={() => "bg-brand-primary"}
              labelClass={() => "text-slate-800 dark:text-orange-200"}
            />
          </div>
        </div>
      </Card>
    </motion>
  );
}
