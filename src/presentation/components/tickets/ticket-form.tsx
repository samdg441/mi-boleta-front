"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Ticket } from "@/domain/entities/ticket";
import { ticketSchema, type TicketFormValues } from "@/presentation/validation/forms";
import { Button } from "@/presentation/components/ui/button";
import { FieldError, FieldLabel, SelectInput, TextArea, TextInput } from "@/presentation/components/ui/field";
import { GAME_TYPES, TICKET_STATUSES } from "@/presentation/constants/ticket-options";
import { fromDateTimeLocalToIso, toDateTimeLocalValue } from "@/presentation/lib/date";

export function TicketForm({
  defaultTicket,
  onSubmit,
  submitLabel,
  disabled,
}: {
  defaultTicket?: Ticket;
  onSubmit: (values: {
    title: string;
    gameType: string;
    gameNumber?: string | null;
    gameDate: string;
    amount?: number | null;
    place?: string | null;
    status: string;
    notes?: string | null;
  }) => Promise<void>;
  submitLabel: string;
  disabled?: boolean;
}) {
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: defaultTicket
        ? {
          title: defaultTicket.title,
          gameType: defaultTicket.gameType,
          gameNumber: defaultTicket.gameNumber ?? "",
          gameDate: toDateTimeLocalValue(defaultTicket.gameDate),
          amount:
            defaultTicket.amount === null || defaultTicket.amount === undefined
              ? ""
              : String(defaultTicket.amount),
          place: defaultTicket.place ?? "",
          status: defaultTicket.status,
          notes: defaultTicket.notes ?? "",
        }
      : {
          title: "",
          gameType: "Lotería",
          gameNumber: "",
          gameDate: "",
          amount: "",
          place: "",
          status: "Pendiente",
          notes: "",
        },
  });

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit({
          title: values.title.trim(),
          gameType: values.gameType,
          gameNumber: values.gameNumber?.trim() || null,
          gameDate: fromDateTimeLocalToIso(values.gameDate),
          amount: values.amount?.trim()
            ? Number(values.amount.replace(",", "."))
            : null,
          place: values.place?.trim() || null,
          status: values.status,
          notes: values.notes?.trim() || null,
        });
      })}
    >
      <div className="md:col-span-2">
        <FieldLabel htmlFor="title">Nombre del sorteo</FieldLabel>
        <TextInput id="title" autoComplete="off" {...form.register("title")} />
        <FieldError message={form.formState.errors.title?.message} />
      </div>

      <div>
        <FieldLabel htmlFor="gameType">Tipo de juego</FieldLabel>
        <SelectInput id="gameType" {...form.register("gameType")}>
          {GAME_TYPES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </SelectInput>
        <FieldError message={form.formState.errors.gameType?.message} />
      </div>

      <div>
        <FieldLabel htmlFor="status">Estado</FieldLabel>
        <SelectInput id="status" {...form.register("status")}>
          {TICKET_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </SelectInput>
        <FieldError message={form.formState.errors.status?.message} />
      </div>

      <div>
        <FieldLabel htmlFor="gameNumber">Número jugado (opcional)</FieldLabel>
        <TextInput id="gameNumber" {...form.register("gameNumber")} />
        <FieldError message={form.formState.errors.gameNumber?.message} />
      </div>

      <div>
        <FieldLabel htmlFor="gameDate">Fecha del sorteo</FieldLabel>
        <TextInput id="gameDate" type="datetime-local" {...form.register("gameDate")} />
        <FieldError message={form.formState.errors.gameDate?.message} />
      </div>

      <div>
        <FieldLabel htmlFor="amount">Valor apostado (opcional)</FieldLabel>
        <TextInput id="amount" inputMode="decimal" {...form.register("amount")} />
        <FieldError message={form.formState.errors.amount?.message as string | undefined} />
      </div>

      <div>
        <FieldLabel htmlFor="place">Lugar de compra (opcional)</FieldLabel>
        <TextInput id="place" {...form.register("place")} />
        <FieldError message={form.formState.errors.place?.message} />
      </div>

      <div className="md:col-span-2">
        <FieldLabel htmlFor="notes">Notas (opcional)</FieldLabel>
        <TextArea id="notes" rows={3} {...form.register("notes")} />
        <FieldError message={form.formState.errors.notes?.message} />
      </div>

      <div className="md:col-span-2 flex justify-end gap-3">
        <Button type="submit" disabled={disabled || form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Guardando…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
