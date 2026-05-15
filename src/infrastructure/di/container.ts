import { createApiClient } from "@/infrastructure/http/api-client";
import { AuthApiRepository } from "@/infrastructure/repositories/auth-api.repository";
import {
  AdminTicketsApiRepository,
  TicketsApiRepository,
} from "@/infrastructure/repositories/tickets-api.repository";
import { useAuthStore } from "@/presentation/stores/auth-store";

function getToken() {
  return useAuthStore.getState().token;
}

function onUnauthorized() {
  useAuthStore.getState().clearSession();
}

const apiClient = createApiClient(getToken, onUnauthorized);

export const authRepository = new AuthApiRepository(apiClient);
export const ticketRepository = new TicketsApiRepository(apiClient);
export const adminTicketRepository = new AdminTicketsApiRepository(apiClient);
