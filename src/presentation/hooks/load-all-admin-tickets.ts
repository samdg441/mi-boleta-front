import { adminTicketRepository } from "@/infrastructure/di/container";
import type { AdminTicket } from "@/domain/entities/ticket";

const MAX_PAGES = 50;

/** Carga todos los tickets del sistema (admin) para métricas globales. */
export async function loadAllAdminTickets(): Promise<{
  tickets: AdminTicket[];
  total: number;
}> {
  const pageSize = 100;
  let page = 1;
  const tickets: AdminTicket[] = [];
  let total = 0;
  let totalPages = 1;

  while (page <= totalPages && page <= MAX_PAGES) {
    const res = await adminTicketRepository.list({ page, pageSize });
    if (page === 1) total = res.meta.total;
    tickets.push(...res.data);
    totalPages = res.meta.totalPages;
    page += 1;
  }

  return { tickets, total };
}
