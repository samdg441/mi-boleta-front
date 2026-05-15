"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { TicketForm } from "@/presentation/components/tickets/ticket-form";
import { ticketRepository } from "@/infrastructure/di/container";
import type { Ticket } from "@/domain/entities/ticket";
import { ApiError } from "@/infrastructure/http/api-error";
import { Card } from "@/presentation/components/ui/card";
import { FieldError } from "@/presentation/components/ui/field";
import { Spinner } from "@/presentation/components/ui/feedback";

export default function EditTicketPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

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

  if (loading) return <Spinner />;
  if (error || !ticket) {
    return (
      <Card title="Editar boleta">
        <p className="text-sm text-red-600">{error ?? "No encontrado."}</p>
        <Link className="mt-4 inline-block text-sm font-semibold text-brand-primary" href="/tickets">
          Volver al listado
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Editar boleta</h1>
        <p className="text-sm text-slate-600">Los cambios se guardan en la API.</p>
      </div>

      <Card
        title={ticket.title}
        actions={
          <Link className="text-sm font-semibold text-brand-primary hover:underline" href={`/tickets/${ticket.id}`}>
            Ver detalle
          </Link>
        }
      >
        <FieldError message={serverError ?? undefined} />
        <TicketForm
          defaultTicket={ticket}
          submitLabel="Guardar cambios"
          onSubmit={async (payload) => {
            setServerError(null);
            try {
              await ticketRepository.update(ticket.id, payload);
              router.replace(`/tickets/${ticket.id}`);
              router.refresh();
            } catch (e) {
              const msg =
                e instanceof ApiError ? e.message : "No se pudo actualizar la boleta.";
              setServerError(msg);
            }
          }}
        />
      </Card>
    </div>
  );
}
