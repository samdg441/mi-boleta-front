import type { Ticket } from "@/domain/entities/ticket";

export function computeTicketStats(tickets: Ticket[], totalFromApi: number) {
  const now = Date.now();
  const upcoming = tickets
    .filter((t) => new Date(t.gameDate).getTime() > now)
    .sort((a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime());
  const pending = tickets.filter((t) => t.status === "Pendiente");
  const history = [...tickets].sort(
    (a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime(),
  );
  return { totalRegistered: totalFromApi, upcoming, pending, history };
}
