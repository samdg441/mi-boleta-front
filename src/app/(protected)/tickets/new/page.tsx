"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { TicketForm } from "@/presentation/components/tickets/ticket-form";
import { PageHeader } from "@/presentation/components/layout/page-header";
import { ticketRepository } from "@/infrastructure/di/container";
import { ApiError } from "@/infrastructure/http/api-error";
import { Card } from "@/presentation/components/ui/card";
import { FieldError } from "@/presentation/components/ui/field";
import { notifyApiError, notifyTicketCreated } from "@/presentation/lib/toast";

export default function NewTicketPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  return (
    <div className="animate-fade-in-up space-y-8">
      <PageHeader
        badge="Nuevo registro"
        icon={PlusCircle}
        title="Nueva boleta"
        description="Completa los datos del sorteo o rifa. Los campos marcados son obligatorios."
      />

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
              notifyTicketCreated(created.title);
              router.replace(`/tickets/${created.id}`);
            } catch (e) {
              const msg =
                e instanceof ApiError ? e.message : "No se pudo crear la boleta.";
              setServerError(msg);
              notifyApiError(msg);
            }
          }}
        />
      </Card>
    </div>
  );
}
