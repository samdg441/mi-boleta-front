"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TicketForm } from "@/presentation/components/tickets/ticket-form";
import { ticketRepository } from "@/infrastructure/di/container";
import { ApiError } from "@/infrastructure/http/api-error";
import { Card } from "@/presentation/components/ui/card";
import { FieldError } from "@/presentation/components/ui/field";

export default function NewTicketPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nueva boleta</h1>
        <p className="text-sm text-slate-600">Completa los datos del sorteo o rifa.</p>
      </div>

      <Card
        title="Formulario"
        actions={
          <Link className="text-sm font-semibold text-brand-primary hover:underline" href="/tickets">
            Volver al listado
          </Link>
        }
      >
        <FieldError message={serverError ?? undefined} />
        <TicketForm
          submitLabel="Crear boleta"
          onSubmit={async (payload) => {
            setServerError(null);
            try {
              const created = await ticketRepository.create(payload);
              router.replace(`/tickets/${created.id}`);
            } catch (e) {
              const msg =
                e instanceof ApiError ? e.message : "No se pudo crear la boleta.";
              setServerError(msg);
            }
          }}
        />
      </Card>
    </div>
  );
}
