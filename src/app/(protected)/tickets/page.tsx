"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ticketRepository } from "@/infrastructure/di/container";
import type { Ticket } from "@/domain/entities/ticket";
import { ApiError } from "@/infrastructure/http/api-error";
import { Card } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { FieldError, SelectInput, TextInput } from "@/presentation/components/ui/field";
import { EmptyState, Spinner } from "@/presentation/components/ui/feedback";
import { GAME_TYPES, TICKET_STATUSES } from "@/presentation/constants/ticket-options";
import { formatShortDate } from "@/presentation/lib/date";

type Filters = { q: string; status: string; gameType: string };

export default function TicketsPage() {
  const [draft, setDraft] = useState<Filters>({ q: "", status: "", gameType: "" });
  const [applied, setApplied] = useState<Filters>(draft);
  const [page, setPage] = useState(1);
  const pageSize = 10;

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
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis boletas</h1>
          <p className="text-sm text-slate-600">Consulta, edita o elimina tus registros.</p>
        </div>
        <Link
          href="/tickets/new"
          className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-hover"
        >
          Nueva boleta
        </Link>
      </div>

      <Card title="Filtros">
        <form className="grid gap-4 md:grid-cols-4" onSubmit={applyFilters}>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="q">
              Búsqueda (título o número)
            </label>
            <TextInput
              id="q"
              value={draft.q}
              onChange={(e) => setDraft((d) => ({ ...d, q: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="status">
              Estado
            </label>
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
            <label className="text-sm font-medium text-slate-700" htmlFor="gameType">
              Tipo
            </label>
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
        <FieldError message={error ?? undefined} />
      </Card>

      <Card title="Listado">
        {loading ? (
          <Spinner />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No hay boletas con estos criterios"
            action={
              <Link
                href="/tickets/new"
                className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-hover"
              >
                Crear boleta
              </Link>
            }
          />
        ) : (
          <>
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
                  {rows.map((t) => (
                    <tr key={t.id}>
                      <td className="py-3 pr-4 font-semibold text-slate-900">{t.title}</td>
                      <td className="py-3 pr-4 text-slate-700">{t.gameType}</td>
                      <td className="py-3 pr-4 text-slate-700">{t.status}</td>
                      <td className="py-3 pr-4 text-slate-700">{formatShortDate(t.gameDate)}</td>
                      <td className="py-3 text-right">
                        <Link
                          className="font-semibold text-brand-primary hover:underline"
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
            <footer className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Página {meta.page} de {meta.totalPages} · {meta.total} registros
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Anterior
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </footer>
          </>
        )}
      </Card>
    </div>
  );
}
