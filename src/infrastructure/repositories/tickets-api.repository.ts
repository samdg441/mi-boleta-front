import type { AdminTicket, PaginatedResult, Ticket } from "@/domain/entities/ticket";
import type {
  AdminTicketListParams,
  AdminTicketRepository,
  CreateTicketInput,
  TicketListParams,
  TicketRepository,
  UpdateTicketInput,
} from "@/domain/repositories/ticket.repository";
import type { ApiClient } from "../http/api-client";

function toQuery(params?: Record<string, string | number | undefined>): string {
  if (!params) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === "") continue;
    sp.set(k, String(v));
  }
  const q = sp.toString();
  return q ? `?${q}` : "";
}

export class TicketsApiRepository implements TicketRepository {
  constructor(private readonly api: ApiClient) {}

  async list(params?: TicketListParams): Promise<PaginatedResult<Ticket>> {
    const query = toQuery({
      status: params?.status,
      gameType: params?.gameType,
      q: params?.q,
      page: params?.page,
      pageSize: params?.pageSize,
    });
    const { data, meta } = await this.api.request<Ticket[]>(`/tickets${query}`);
    return {
      data,
      meta: meta as PaginatedResult<Ticket>["meta"],
    };
  }

  async getById(id: string): Promise<Ticket> {
    const { data } = await this.api.request<Ticket>(`/tickets/${id}`);
    return data;
  }

  async create(input: CreateTicketInput): Promise<Ticket> {
    const { data } = await this.api.request<Ticket>("/tickets", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return data;
  }

  async update(id: string, input: UpdateTicketInput): Promise<Ticket> {
    const { data } = await this.api.request<Ticket>(`/tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
    return data;
  }

  async delete(id: string): Promise<void> {
    await this.api.request<undefined>(`/tickets/${id}`, { method: "DELETE" });
  }
}

export class AdminTicketsApiRepository implements AdminTicketRepository {
  constructor(private readonly api: ApiClient) {}

  async list(
    params?: AdminTicketListParams,
  ): Promise<PaginatedResult<AdminTicket>> {
    const query = toQuery({
      status: params?.status,
      gameType: params?.gameType,
      q: params?.q,
      page: params?.page,
      pageSize: params?.pageSize,
      userId: params?.userId,
    });
    const { data, meta } = await this.api.request<AdminTicket[]>(
      `/admin/tickets${query}`,
    );
    return {
      data,
      meta: meta as PaginatedResult<AdminTicket>["meta"],
    };
  }
}
