import type { AdminTicket } from "@/domain/entities/ticket";
import { GAME_TYPES, TICKET_STATUSES } from "@/presentation/constants/ticket-options";

export type CountRow = { label: string; count: number; percent: number };

export type AdminAnalytics = {
  uniqueUsers: number;
  winRate: number;
  resolvedCount: number;
  byStatus: CountRow[];
  byGameType: CountRow[];
};

export function computeAdminAnalytics(tickets: AdminTicket[]): AdminAnalytics {
  const total = tickets.length;
  const statusCounts = Object.fromEntries(TICKET_STATUSES.map((s) => [s, 0])) as Record<
    string,
    number
  >;
  const typeCounts = Object.fromEntries(GAME_TYPES.map((g) => [g, 0])) as Record<string, number>;
  const owners = new Set<string>();

  for (const t of tickets) {
    statusCounts[t.status] = (statusCounts[t.status] ?? 0) + 1;
    typeCounts[t.gameType] = (typeCounts[t.gameType] ?? 0) + 1;
    owners.add(t.owner.email);
  }

  const won = statusCounts.Ganado ?? 0;
  const lost = statusCounts.Perdido ?? 0;
  const resolvedCount = won + lost;
  const winRate = resolvedCount > 0 ? Math.round((won / resolvedCount) * 100) : 0;

  const toRows = (entries: [string, number][]): CountRow[] =>
    entries
      .filter(([, count]) => count > 0)
      .map(([label, count]) => ({
        label,
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

  return {
    uniqueUsers: owners.size,
    winRate,
    resolvedCount,
    byStatus: toRows(Object.entries(statusCounts)),
    byGameType: toRows(Object.entries(typeCounts)),
  };
}
