"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  ClipboardList,
  History,
  Sparkles,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { loadAllMyTickets } from "@/presentation/hooks/load-all-tickets";
import type { Ticket } from "@/domain/entities/ticket";
import { ApiError } from "@/infrastructure/http/api-error";
import { Card } from "@/presentation/components/ui/card";
import { EmptyState, Spinner } from "@/presentation/components/ui/feedback";
import { Button } from "@/presentation/components/ui/button";
import { GradientLink } from "@/presentation/components/ui/gradient-link";
import { PageHeader } from "@/presentation/components/layout/page-header";
import { formatShortDate } from "@/presentation/lib/date";
import { useAuthStore } from "@/presentation/stores/auth-store";
import { useAuthHydration } from "@/presentation/hooks/use-auth-hydration";

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
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthHydration();

  useEffect(() => {
    if (!hydrated) return;
    if (user?.role === "admin") router.replace("/admin");
  }, [hydrated, user, router]);

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
        <p className="text-sm font-medium text-red-600">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Panel principal"
        icon={Sparkles}
        title="Hola, aquí va tu suerte en orden"
        description="Visualiza totales, lo que viene en el calendario, pendientes por resultado y tu historial completo."
        actions={<GradientLink href="/tickets/new">Nueva boleta</GradientLink>}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Juegos registrados"
          value={String(stats.totalRegistered)}
          icon={ClipboardList}
          accent="from-slate-800 to-slate-900"
        />
        <StatCard
          label="Próximos sorteos"
          value={String(stats.upcoming.length)}
          icon={CalendarClock}
          accent="from-brand-primary to-brand-glow"
        />
        <StatCard
          label="Pendientes"
          value={String(stats.pending.length)}
          icon={Timer}
          accent="from-sky-500 to-blue-600"
        />
        <StatCard
          label="Historial cargado"
          value={String(stats.history.length)}
          hint="Desde la API (paginado)"
          icon={History}
          accent="from-violet-500 to-purple-600"
        />
      </section>

      <Card
        title="Próximos sorteos"
        actions={<GradientLink href="/tickets/new">Añadir boleta</GradientLink>}
      >
        {stats.upcoming.length === 0 ? (
          <EmptyState
            title="No hay sorteos futuros"
            description="Cuando registres boletas con fecha posterior a hoy, aparecerán aquí con fecha resaltada."
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {stats.upcoming.slice(0, 8).map((t) => (
              <li
                key={t.id}
                className="flex flex-col gap-2 py-4 transition hover:bg-orange-50/40 sm:flex-row sm:items-center sm:justify-between sm:px-2"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{t.title}</p>
                  <p className="mt-0.5 text-sm text-slate-600">
                    <span className="font-medium text-slate-700">{t.gameType}</span>
                    <span className="text-slate-400"> · </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                      {t.status}
                    </span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm">
                    {formatShortDate(t.gameDate)}
                  </span>
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
          <ul className="divide-y divide-slate-100">
            {stats.pending.slice(0, 8).map((t) => (
              <li key={t.id} className="py-4 transition hover:bg-slate-50/80 sm:px-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{t.title}</p>
                    <p className="text-sm text-slate-600">{t.gameType}</p>
                  </div>
                  <Link
                    className="inline-flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700"
                    href={`/tickets/${t.id}`}
                  >
                    Ver detalle →
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
            action={<GradientLink href="/tickets/new">Crear la primera</GradientLink>}
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Sorteo</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3 text-right" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {stats.history.map((t) => (
                    <tr key={t.id} className="transition hover:bg-orange-50/30">
                      <td className="px-4 py-3 font-semibold text-slate-900">{t.title}</td>
                      <td className="px-4 py-3 text-slate-700">{t.gameType}</td>
                      <td className="px-4 py-3 text-slate-700">{t.status}</td>
                      <td className="px-4 py-3 text-slate-700">{formatShortDate(t.gameDate)}</td>
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
        )}
      </Card>
    </div>
  );
}

function StatCard({
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
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-lift shadow-slate-900/5 backdrop-blur-xl transition hover:-translate-y-0.5">
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-400/10 blur-2xl transition group-hover:bg-orange-400/20" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
          {hint ? <p className="mt-1 text-xs font-medium text-slate-500">{hint}</p> : null}
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
