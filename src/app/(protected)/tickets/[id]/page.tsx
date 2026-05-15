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
import { formatShortDate } from "@/presentation/lib/date";

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
      router.replace("/tickets");
      router.refresh();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "No se pudo eliminar.";
      setDeleteError(msg);
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
    <div className="space-y-6">
      <FieldError message={deleteError ?? undefined} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{ticket.title}</h1>
          <p className="text-sm text-slate-600">Detalle de tu registro</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/tickets"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Volver
          </Link>
          <Link
            href={`/tickets/${ticket.id}/edit`}
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-hover"
          >
            Editar
          </Link>
          <Button variant="danger" onClick={onDelete}>
            Eliminar
          </Button>
        </div>
      </div>

      <Card title="Información">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">Tipo de juego</dt>
            <dd className="mt-1 text-sm text-slate-900">{ticket.gameType}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">Estado</dt>
            <dd className="mt-1 text-sm text-slate-900">{ticket.status}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">Fecha del sorteo</dt>
            <dd className="mt-1 text-sm text-slate-900">{formatShortDate(ticket.gameDate)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">Número jugado</dt>
            <dd className="mt-1 text-sm text-slate-900">{ticket.gameNumber ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">Valor apostado</dt>
            <dd className="mt-1 text-sm text-slate-900">
              {ticket.amount === null || ticket.amount === undefined
                ? "—"
                : new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(
                    ticket.amount,
                  )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">Lugar</dt>
            <dd className="mt-1 text-sm text-slate-900">{ticket.place ?? "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase text-slate-500">Notas</dt>
            <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-900">
              {ticket.notes ?? "—"}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
