"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ticketRepository } from "@/infrastructure/di/container";
import type { Ticket } from "@/domain/entities/ticket";
import { ApiError } from "@/infrastructure/http/api-error";
import { Card } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Spinner } from "@/presentation/components/ui/feedback";
import { FieldError } from "@/presentation/components/ui/field";
import { FileText } from "lucide-react";
import { PageHeader } from "@/presentation/components/layout/page-header";
import { formatShortDate, daysUntilSorteo } from "@/presentation/lib/date";
import { DaysUntilBadge } from "@/presentation/components/ui/days-until-badge";
import { notifyApiError, notifyTicketDeleted } from "@/presentation/lib/toast";

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const t = await ticketRepository.getById(id);
        if (!cancelled) setTicket(t);
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof ApiError ? e.message : "No se pudo cargar la boleta.";
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function onDelete() {
    if (!ticket) return;
    const ok = window.confirm(
      "¿Seguro que deseas eliminar esta boleta? Esta acción no se puede deshacer.",
    );
    if (!ok) return;
    setDeleteError(null);
    try {
      await ticketRepository.delete(ticket.id);
      notifyTicketDeleted();
      router.replace("/tickets");
      router.refresh();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "No se pudo eliminar.";
      setDeleteError(msg);
      notifyApiError(msg);
    }
  }

  if (loading) return <Spinner />;
  if (error || !ticket) {
    return (
      <Card title="Detalle">
        <p className="text-sm text-red-600">{error ?? "No encontrado."}</p>
        <Link className="mt-4 inline-block text-sm font-semibold text-brand-primary" href="/tickets">
          Volver al listado
        </Link>
      </Card>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-8">
      <FieldError message={deleteError ?? undefined} />
      <PageHeader
        badge="Detalle"
        icon={FileText}
        title={ticket.title}
        description="Información completa de tu registro."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/tickets"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              Volver
            </Link>
            <Link
              href={`/tickets/${ticket.id}/edit`}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-500/25 transition hover:from-orange-600 hover:to-orange-700"
            >
              Editar
            </Link>
            <Button variant="danger" onClick={onDelete}>
              Eliminar
            </Button>
          </div>
        }
      />

      <Card title="Información">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Tipo de juego</dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">{ticket.gameType}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Estado</dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">{ticket.status}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Fecha del sorteo</dt>
            <dd className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-900 dark:text-slate-100">
              <span>{formatShortDate(ticket.gameDate)}</span>
              {daysUntilSorteo(ticket.gameDate) >= 0 ? (
                <DaysUntilBadge gameDate={ticket.gameDate} />
              ) : null}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Número jugado</dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">{ticket.gameNumber ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Valor apostado</dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">
              {ticket.amount === null || ticket.amount === undefined
                ? "—"
                : new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
                    ticket.amount,
                  )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Lugar</dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">{ticket.place ?? "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Notas</dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-900 dark:text-slate-100">
              {ticket.notes ?? "—"}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
