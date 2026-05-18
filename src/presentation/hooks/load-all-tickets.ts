import { ticketRepository } from "@/infrastructure/di/container";
import type { Ticket } from "@/domain/entities/ticket";
import { LIST_PAGE_SIZE } from "@/presentation/constants/pagination";

const MAX_PAGES = 50;

export async function loadAllMyTickets(): Promise<{
  tickets: Ticket[];
  total: number;
}> {
  const pageSize = LIST_PAGE_SIZE;
  let page = 1;
  const tickets: Ticket[] = [];
  let total = 0;
  let totalPages = 1;

  while (page <= totalPages && page <= MAX_PAGES) {
    const res = await ticketRepository.list({ page, pageSize });
    if (page === 1) total = res.meta.total;
    tickets.push(...res.data);
    totalPages = res.meta.totalPages;
    page += 1;
  }

  return { tickets, total };
}
