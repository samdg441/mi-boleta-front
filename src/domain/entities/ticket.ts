export type GameType =
  | "Lotería"
  | "Rifa"
  | "Sorteo"
  | "Boleta"
  | "Juego ocasional";

export type TicketStatus = "Pendiente" | "Ganado" | "Perdido";

export interface Ticket {
  id: string;
  title: string;
  gameType: GameType;
  gameNumber: string | null;
  gameDate: string;
  amount: number | null;
  place: string | null;
  status: TicketStatus;
  notes: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface TicketOwner {
  id: string;
  name: string;
  email: string;
}

export interface AdminTicket extends Ticket {
  owner: TicketOwner;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginatedMeta;
}
