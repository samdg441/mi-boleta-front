import type {
  AdminTicket,
  PaginatedResult,
  Ticket,
} from "../entities/ticket";

export interface TicketListParams {
  status?: string;
  gameType?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateTicketInput {
  title: string;
  gameType: string;
  gameNumber?: string | null;
  gameDate: string;
  amount?: number | null;
  place?: string | null;
  status: string;
  notes?: string | null;
}

export type UpdateTicketInput = Partial<CreateTicketInput>;

export interface TicketRepository {
  list(params?: TicketListParams): Promise<PaginatedResult<Ticket>>;
  getById(id: string): Promise<Ticket>;
  create(input: CreateTicketInput): Promise<Ticket>;
  update(id: string, input: UpdateTicketInput): Promise<Ticket>;
  delete(id: string): Promise<void>;
}

export interface AdminTicketListParams extends TicketListParams {
  userId?: string;
}

export interface AdminTicketRepository {
  list(params?: AdminTicketListParams): Promise<PaginatedResult<AdminTicket>>;
}
