import type { GameType, TicketStatus } from "@/domain/entities/ticket";

export const GAME_TYPES: GameType[] = [
  "Lotería",
  "Rifa",
  "Sorteo",
  "Boleta",
  "Juego ocasional",
];

export const TICKET_STATUSES: TicketStatus[] = [
  "Pendiente",
  "Ganado",
  "Perdido",
];
