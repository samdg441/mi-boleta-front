"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Ticket as TicketIcon } from "lucide-react";
import { ticketRepository } from "@/infrastructure/di/container";
import type { Ticket } from "@/domain/entities/ticket";
import { ApiError } from "@/infrastructure/http/api-error";
import { Card } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { FieldError, FieldLabel, SelectInput, TextInput } from "@/presentation/components/ui/field";
import { EmptyState } from "@/presentation/components/ui/feedback";
import { TableSkeleton } from "@/presentation/components/ui/skeleton";
import {
  DataTableRow,
  DataTableShell,
  dataTableBodyClass,
  dataTableHeadClass,
} from "@/presentation/components/ui/data-table";
import { GradientLink } from "@/presentation/components/ui/gradient-link";
import { PaginationBar } from "@/presentation/components/ui/pagination";
import { PageHeader } from "@/presentation/components/layout/page-header";
import { LIST_PAGE_SIZE } from "@/presentation/constants/pagination";
import { GAME_TYPES, TICKET_STATUSES } from "@/presentation/constants/ticket-options";
import { formatShortDate } from "@/presentation/lib/date";
import { toast } from "@/presentation/lib/toast";

type Filters = { q: string; status: string; gameType: string };

export default function TicketsPage() {
  const [draft, setDraft] = useState<Filters>({ q: "", status: "", gameType: "" });
  const [applied, setApplied] = useState<Filters>(draft);
  const [page, setPage] = useState(1);
  const pageSize = LIST_PAGE_SIZE;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Ticket[]>([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, page: 1, pageSize });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await ticketRepository.list({
          q: applied.q.trim() || undefined,
          status: applied.status || undefined,
          gameType: applied.gameType || undefined,
          page,
          pageSize,
        });
        if (cancelled) return;
        setRows(res.data);
        setMeta(res.meta);
      } catch (e) {
        if (cancelled) return;
        const msg =
          e instanceof ApiError ? e.message : "No se pudo cargar la lista de boletas.";
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applied, page, pageSize]);

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    setApplied(draft);
    setPage(1);
    toast.success("Filtros aplicados");
  }

  return (
    <div className="space-y-8">
      <PageHeader
        badge="Tus registros"
        icon={TicketIcon}
        title="Mis boletas"
        description="Filtra por texto, estado o tipo. La paginación muestra 10 registros por página."
        actions={
          <GradientLink href="/tickets/new" className="gap-2">
            <Plus className="h-4 w-4" aria-hidden />
            Nueva boleta
          </GradientLink>
        }
      />

      <div className="animate-fade-in-up" style={{ animationDelay: "80ms", animationFillMode: "both" }}>
      <Card title="Filtros">
        <form className="grid gap-4 md:grid-cols-4" onSubmit={applyFilters}>
          <div className="md:col-span-2">
            <FieldLabel htmlFor="q">Búsqueda (título o número)</FieldLabel>
            <TextInput
              id="q"
              value={draft.q}
              onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))}
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
            <FieldLabel htmlFor="gameType">Tipo</FieldLabel>
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
          <div className="md:col-span-4">
            <Button type="submit">Aplicar filtros</Button>
          </div>
        </form>
        {error ? (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50/70 px-3 py-2 dark:border-red-900/50 dark:bg-red-950/40">
            <FieldError message={error} />
          </div>
        ) : null}
      </Card>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "120ms", animationFillMode: "both" }}>
      <Card title="Listado">
        {loading ? (
          <TableSkeleton rows={8} cols={5} />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No hay boletas con estos criterios"
            description="Prueba otros filtros o crea tu primera boleta."
            action={<GradientLink href="/tickets/new">Crear boleta</GradientLink>}
          />
        ) : (
          <>
            <DataTableShell>
              <table className="min-w-full text-left text-sm">
                <thead className={dataTableHeadClass}>
                  <tr>
                    <th className="px-4 py-3">Sorteo</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3 text-right" />
                  </tr>
                </thead>
                <tbody className={dataTableBodyClass}>
                  {rows.map((t, i) => (
                    <DataTableRow key={t.id} index={i}>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                        {t.title}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{t.gameType}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{t.status}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                        {formatShortDate(t.gameDate)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          className="font-bold text-orange-600 transition hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300"
                          href={`/tickets/${t.id}`}
                        >
                          Ver
                        </Link>
                      </td>
                    </DataTableRow>
                  ))}
                </tbody>
              </table>
            </DataTableShell>
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
    </div>
  );
}
