"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadAllMyTickets } from "@/presentation/hooks/load-all-tickets";
import type { Ticket } from "@/domain/entities/ticket";
import { ApiError } from "@/infrastructure/http/api-error";
import { Card } from "@/presentation/components/ui/card";
import { EmptyState, Spinner } from "@/presentation/components/ui/feedback";
import { Button } from "@/presentation/components/ui/button";
import { formatShortDate } from "@/presentation/lib/date";

function computeStats(tickets: Ticket[], totalFromApi: number) {
  const now = Date.now();
  const upcoming = tickets
    .filter((t) => new Date(t.gameDate).getTime() > now)
    .sort((a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime());
  const pending = tickets.filter((t) => t.status === "Pendiente");
  const history = [...tickets].sort(
    (a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime(),
  );
  return { totalRegistered: totalFromApi, upcoming, pending, history };
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await loadAllMyTickets();
        if (cancelled) return;
        setTickets(res.tickets);
        setTotal(res.total);
      } catch (e) {
        if (cancelled) return;
        const msg =
          e instanceof ApiError ? e.message : "No se pudo cargar el dashboard.";
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(
    () => computeStats(tickets, total),
    [tickets, total],
  );

  if (loading) {
    return <Spinner label="Cargando tu resumen…" />;
  }

  if (error) {
    return (
      <Card title="Dashboard">
        <p className="text-sm text-red-600">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600">
          Resumen de tus juegos y próximos sorteos.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Juegos registrados" value={String(stats.totalRegistered)} />
        <StatCard label="Próximos sorteos" value={String(stats.upcoming.length)} />
        <StatCard label="Pendientes" value={String(stats.pending.length)} />
        <StatCard
          label="En historial (cargados)"
          value={String(stats.history.length)}
          hint="Lista completa debajo"
        />
      </section>

      <Card
        title="Próximos sorteos"
        actions={
          <Link
            href="/tickets/new"
            className="rounded-lg bg-brand-primary px-3 py-2 text-sm font-semibold text-white hover:bg-brand-primary-hover"
          >
            Nueva boleta
          </Link>
        }
      >
        {stats.upcoming.length === 0 ? (
          <EmptyState
            title="No hay sorteos futuros"
            description="Cuando registres boletas con fecha posterior a hoy, aparecerán aquí."
          />
        ) : (
          <ul className="divide-y divide-slate-200">
            {stats.upcoming.slice(0, 8).map((t) => (
              <li key={t.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{t.title}</p>
                  <p className="text-sm text-slate-600">
                    {t.gameType} · {t.status}
                  </p>
                </div>
                <div className="text-sm font-medium text-slate-800">
                  {formatShortDate(t.gameDate)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Juegos pendientes (estado)">
        {stats.pending.length === 0 ? (
          <EmptyState title="No tienes juegos en estado Pendiente" />
        ) : (
          <ul className="divide-y divide-slate-200">
            {stats.pending.slice(0, 8).map((t) => (
              <li key={t.id} className="py-3">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{t.title}</p>
                    <p className="text-sm text-slate-600">{t.gameType}</p>
                  </div>
                  <Link className="text-sm font-semibold text-brand-primary hover:underline" href={`/tickets/${t.id}`}>
                    Ver detalle
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Historial">
        {stats.history.length === 0 ? (
          <EmptyState
            title="Aún no registras boletas"
            action={
              <Link
                href="/tickets/new"
                className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-hover"
              >
                Crear la primera
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2 pr-4">Sorteo</th>
                  <th className="py-2 pr-4">Tipo</th>
                  <th className="py-2 pr-4">Estado</th>
                  <th className="py-2 pr-4">Fecha</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.history.map((t) => (
                  <tr key={t.id}>
                    <td className="py-3 pr-4 font-medium text-slate-900">{t.title}</td>
                    <td className="py-3 pr-4 text-slate-700">{t.gameType}</td>
                    <td className="py-3 pr-4 text-slate-700">{t.status}</td>
                    <td className="py-3 pr-4 text-slate-700">{formatShortDate(t.gameDate)}</td>
                    <td className="py-3 text-right">
                      <Link className="font-semibold text-brand-primary hover:underline" href={`/tickets/${t.id}`}>
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
