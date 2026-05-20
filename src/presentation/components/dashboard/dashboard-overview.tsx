"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Ticket } from "@/domain/entities/ticket";
import { Card } from "@/presentation/components/ui/card";
import { EmptyState } from "@/presentation/components/ui/feedback";
import { GradientLink } from "@/presentation/components/ui/gradient-link";
import { DashboardStatsRow } from "@/presentation/components/dashboard/dashboard-stats-row";
import { computeTicketStats } from "@/presentation/lib/ticket-stats";
import { formatShortDate } from "@/presentation/lib/date";
import {
  ClientPaginationFooter,
  paginate,
} from "@/presentation/components/ui/client-pagination";
import {
  DASHBOARD_HISTORY_PAGE_SIZE,
  DASHBOARD_PENDING_PAGE_SIZE,
  DASHBOARD_UPCOMING_PAGE_SIZE,
} from "@/presentation/constants/pagination";

export function DashboardOverview({
  tickets,
  total,
}: {
  tickets: Ticket[];
  total: number;
}) {
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  const stats = useMemo(() => computeTicketStats(tickets, total), [tickets, total]);

  const upcomingPaged = useMemo(
    () => paginate(stats.upcoming, upcomingPage, DASHBOARD_UPCOMING_PAGE_SIZE),
    [stats.upcoming, upcomingPage],
  );

  const pendingPaged = useMemo(
    () => paginate(stats.pending, pendingPage, DASHBOARD_PENDING_PAGE_SIZE),
    [stats.pending, pendingPage],
  );

  const historyPaged = useMemo(
    () => paginate(stats.history, historyPage, DASHBOARD_HISTORY_PAGE_SIZE),
    [stats.history, historyPage],
  );

  return (
    <>
      <DashboardStatsRow
        counts={{
          totalRegistered: stats.totalRegistered,
          upcoming: stats.upcoming.length,
          pending: stats.pending.length,
          history: stats.history.length,
        }}
      />

      <Card
        title="Próximos sorteos"
        actions={<GradientLink href="/tickets/new">Añadir boleta</GradientLink>}
      >
        {stats.upcoming.length === 0 ? (
          <EmptyState
            title="No hay sorteos futuros"
            description="Cuando registres boletas con fecha posterior a hoy, aparecerán aquí."
          />
        ) : (
          <>
            <TicketList items={upcomingPaged.items} showDateBadge />
            <ClientPaginationFooter
              total={upcomingPaged.total}
              page={upcomingPaged.page}
              pageSize={DASHBOARD_UPCOMING_PAGE_SIZE}
              onPageChange={setUpcomingPage}
            />
          </>
        )}
      </Card>

      <Card title="Juegos pendientes (estado)">
        {stats.pending.length === 0 ? (
          <EmptyState title="No hay juegos en estado Pendiente" />
        ) : (
          <>
            <TicketList items={pendingPaged.items} showDetailLink />
            <ClientPaginationFooter
              total={pendingPaged.total}
              page={pendingPaged.page}
              pageSize={DASHBOARD_PENDING_PAGE_SIZE}
              onPageChange={setPendingPage}
            />
          </>
        )}
      </Card>

      <Card title="Historial">
        {stats.history.length === 0 ? (
          <EmptyState
            title="Sin registros"
            action={<GradientLink href="/tickets/new">Crear la primera</GradientLink>}
          />
        ) : (
          <>
            <HistoryTable items={historyPaged.items} />
            <ClientPaginationFooter
              total={historyPaged.total}
              page={historyPaged.page}
              pageSize={DASHBOARD_HISTORY_PAGE_SIZE}
              onPageChange={setHistoryPage}
            />
          </>
        )}
      </Card>
    </>
  );
}

function TicketList({
  items,
  showDateBadge,
  showDetailLink,
}: {
  items: Ticket[];
  showDateBadge?: boolean;
  showDetailLink?: boolean;
}) {
  return (
    <ul className="divide-y divide-slate-100">
      {items.map((t) => (
        <li
          key={t.id}
          className="flex flex-col gap-2 py-4 transition hover:bg-orange-50/40 dark:hover:bg-orange-950/30 sm:flex-row sm:items-center sm:justify-between sm:px-2"
        >
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{t.title}</p>
            <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">{t.gameType}</span>
              <span className="text-slate-400"> · </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {t.status}
              </span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {showDateBadge ? (
              <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm">
                {formatShortDate(t.gameDate)}
              </span>
            ) : null}
            {showDetailLink ? (
              <Link
                className="inline-flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700"
                href={`/tickets/${t.id}`}
              >
                Ver detalle →
              </Link>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

function HistoryTable({ items }: { items: Ticket[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/90 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Sorteo</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3 text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
            {items.map((t) => (
              <tr key={t.id} className="transition hover:bg-orange-50/30 dark:hover:bg-orange-950/20">
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{t.title}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{t.gameType}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{t.status}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{formatShortDate(t.gameDate)}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    className="font-bold text-orange-600 hover:text-orange-700"
                    href={`/tickets/${t.id}`}
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
