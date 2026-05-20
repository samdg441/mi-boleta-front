"use client";

import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Shield } from "lucide-react";
import { adminTicketRepository } from "@/infrastructure/di/container";
import type { AdminTicket } from "@/domain/entities/ticket";
import { ApiError } from "@/infrastructure/http/api-error";
import { PageHeader } from "@/presentation/components/layout/page-header";
import { DashboardStatsRow } from "@/presentation/components/dashboard/dashboard-stats-row";
import { AdminStatisticsPanel } from "@/presentation/components/admin/admin-statistics-panel";
import { Card } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { FieldError, FieldLabel, SelectInput, TextInput } from "@/presentation/components/ui/field";
import { EmptyState, Spinner } from "@/presentation/components/ui/feedback";
import { PaginationBar } from "@/presentation/components/ui/pagination";
import { GAME_TYPES, TICKET_STATUSES } from "@/presentation/constants/ticket-options";
import { LIST_PAGE_SIZE } from "@/presentation/constants/pagination";
import { buildAdminSearchQuery } from "@/presentation/lib/admin-search";
import { formatShortDate } from "@/presentation/lib/date";
import { computeTicketStats } from "@/presentation/lib/ticket-stats";
import { computeAdminAnalytics } from "@/presentation/lib/admin-analytics";
import { loadAllAdminTickets } from "@/presentation/hooks/load-all-admin-tickets";
import { toast } from "@/presentation/lib/toast";

type Filters = {
  gameNumber: string;
  ownerOrTitle: string;
  status: string;
  gameType: string;
};

const emptyFilters: Filters = {
  gameNumber: "",
  ownerOrTitle: "",
  status: "",
  gameType: "",
};

const adminStatLabels = {
  total: "Boletas en el sistema",
  upcoming: "Próximos sorteos",
  pending: "Pendientes",
  history: "En historial",
} as const;

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "Ganado"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : status === "Perdido"
        ? "bg-red-50 text-red-800 border-red-200"
        : "bg-amber-50 text-amber-800 border-amber-200";
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${styles}`}>
      {status}
    </span>
  );
}

export default function AdminTicketsPage() {
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [applied, setApplied] = useState<Filters>(emptyFilters);
  const [page, setPage] = useState(1);

  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [allTickets, setAllTickets] = useState<AdminTicket[]>([]);
  const [metricsTotal, setMetricsTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<AdminTicket[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    totalPages: 1,
    page: 1,
    pageSize: LIST_PAGE_SIZE,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setMetricsLoading(true);
        setMetricsError(null);
        const res = await loadAllAdminTickets();
        if (cancelled) return;
        setAllTickets(res.tickets);
        setMetricsTotal(res.total);
      } catch (e) {
        if (cancelled) return;
        const msg =
          e instanceof ApiError ? e.message : "No se pudieron cargar las métricas globales.";
        setMetricsError(msg);
      } finally {
        if (!cancelled) setMetricsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await adminTicketRepository.list({
          q: buildAdminSearchQuery(applied.gameNumber, applied.ownerOrTitle),
          status: applied.status || undefined,
          gameType: applied.gameType || undefined,
          page,
          pageSize: LIST_PAGE_SIZE,
        });
        if (cancelled) return;
        setRows(res.data);
        setMeta(res.meta);
      } catch (e) {
        if (cancelled) return;
        const msg =
          e instanceof ApiError ? e.message : "No se pudo cargar el listado.";
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applied, page]);

  const ticketStats = useMemo(
    () => computeTicketStats(allTickets, metricsTotal),
    [allTickets, metricsTotal],
  );

  const analytics = useMemo(() => computeAdminAnalytics(allTickets), [allTickets]);

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    setApplied(draft);
    setPage(1);
    toast.success("Filtros aplicados");
  }

  function clearFilters() {
    setDraft(emptyFilters);
    setApplied(emptyFilters);
    setPage(1);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        accent="violet"
        icon={Shield}
        badge="Área restringida"
        title="Panel de administración"
        description="Consulta métricas globales, estadísticas del sistema y filtra todas las boletas. Solo lectura: no puedes crear ni editar registros."
      />

      {metricsLoading ? (
        <Spinner label="Cargando métricas globales…" />
      ) : metricsError ? (
        <Card title="Resumen">
          <p className="text-sm font-medium text-red-600">{metricsError}</p>
        </Card>
      ) : (
        <>
          <DashboardStatsRow
            labels={adminStatLabels}
            counts={{
              totalRegistered: ticketStats.totalRegistered,
              upcoming: ticketStats.upcoming.length,
              pending: ticketStats.pending.length,
              history: ticketStats.history.length,
            }}
          />
          <AdminStatisticsPanel analytics={analytics} />
        </>
      )}

      <Card title="Buscar y filtrar registros">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={applyFilters}>
          <div>
            <FieldLabel htmlFor="gameNumber">Buscar por número</FieldLabel>
            <TextInput
              id="gameNumber"
              value={draft.gameNumber}
              onChange={(e) => setDraft((d) => ({ ...d, gameNumber: e.target.value }))}
              placeholder="Ej. 1234"
            />
          </div>
          <div>
            <FieldLabel htmlFor="ownerOrTitle">Buscar por nombre (dueño o sorteo)</FieldLabel>
            <TextInput
              id="ownerOrTitle"
              value={draft.ownerOrTitle}
              onChange={(e) => setDraft((d) => ({ ...d, ownerOrTitle: e.target.value }))}
              placeholder="Ej. Juan o Lotería de Medellín"
            />
          </div>
          <div>
            <FieldLabel htmlFor="status">Estado</FieldLabel>
            <SelectInput
              id="status"
              value={draft.status}
              onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
            >
              <option value="">Todos</option>
              {TICKET_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </SelectInput>
          </div>
          <div>
            <FieldLabel htmlFor="gameType">Tipo de juego</FieldLabel>
            <SelectInput
              id="gameType"
              value={draft.gameType}
              onChange={(e) => setDraft((d) => ({ ...d, gameType: e.target.value }))}
            >
              <option value="">Todos</option>
              {GAME_TYPES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </SelectInput>
          </div>
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <Button type="submit">Aplicar filtros</Button>
            <Button type="button" variant="secondary" className="gap-2" onClick={clearFilters}>
              <RotateCcw className="h-4 w-4" aria-hidden />
              Limpiar
            </Button>
          </div>
        </form>
        {error ? (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50/70 px-3 py-2">
            <FieldError message={error} />
          </div>
        ) : null}
      </Card>

      <Card title="Registros del sistema">
        {loading ? (
          <Spinner label="Cargando listado…" />
        ) : rows.length === 0 ? (
          <EmptyState
            title="Sin resultados"
            description="Prueba otro número, nombre o combina filtros de estado y tipo."
          />
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/90 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Sorteo</th>
                      <th className="px-4 py-3">Número</th>
                      <th className="px-4 py-3">Dueño</th>
                      <th className="px-4 py-3">Tipo</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Fecha sorteo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
                    {rows.map((t) => (
                      <tr key={t.id} className="transition hover:bg-violet-50/40 dark:hover:bg-violet-950/30">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{t.title}</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">
                          {t.gameNumber ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                          <p className="font-medium">{t.owner.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t.owner.email}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{t.gameType}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={t.status} />
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                          {formatShortDate(t.gameDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <PaginationBar
              page={meta.page}
              totalPages={meta.totalPages}
              total={meta.total}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>
    </div>
  );
}
