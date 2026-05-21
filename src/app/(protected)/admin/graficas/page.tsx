"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3, TrendingUp, Users } from "lucide-react";
import type { AdminTicket } from "@/domain/entities/ticket";
import { ApiError } from "@/infrastructure/http/api-error";
import { PageHeader } from "@/presentation/components/layout/page-header";
import { AdminChartsPanel } from "@/presentation/components/admin/admin-charts-panel";
import { Card } from "@/presentation/components/ui/card";
import { ChartsSkeleton } from "@/presentation/components/ui/skeleton";
import { computeAdminAnalytics } from "@/presentation/lib/admin-analytics";
import { loadAllAdminTickets } from "@/presentation/hooks/load-all-admin-tickets";

export default function AdminChartsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await loadAllAdminTickets();
        if (cancelled) return;
        setTickets(res.tickets);
        setTotal(res.total);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof ApiError ? e.message : "No se pudieron cargar los datos.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const analytics = useMemo(() => computeAdminAnalytics(tickets), [tickets]);

  if (loading) {
    return <ChartsSkeleton />;
  }

  return (
    <div className="animate-fade-in-up space-y-8">
      <PageHeader
        accent="violet"
        icon={BarChart3}
        badge="Visualización"
        title="Gráficas del sistema"
        description="Vista dedicada a la distribución global de boletas. El panel admin conserva el listado y filtros."
        actions={
          <Link
            href="/admin"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Volver al panel
          </Link>
        }
      />

      {error ? (
        <Card title="Error">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-violet-500/30 dark:bg-violet-950/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
                  <Users className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-violet-800 dark:text-violet-300">
                    Usuarios activos
                  </p>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {analytics.uniqueUsers}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-emerald-500/30 dark:bg-emerald-950/50">
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
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-600 dark:bg-slate-800/70">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Total en sistema
              </p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{total}</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">boletas analizadas</p>
            </div>
          </div>

          <AdminChartsPanel analytics={analytics} />
        </>
      )}
    </div>
  );
}
