import { ApiError } from "./api-error";

const DEFAULT_BASE = "http://localhost:4000/api/v1";

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return url && url.length > 0 ? url.replace(/\/$/, "") : DEFAULT_BASE;
}

export type GetAccessToken = () => string | null;
export type OnUnauthorized = () => void;

export interface ApiEnvelope<T> {
  data: T;
  meta?: unknown;
}

export interface ApiErrorBody {
  error?: string;
}

export function createApiClient(
  getToken: GetAccessToken,
  onUnauthorized: OnUnauthorized,
) {
  async function request<T>(
    path: string,
    init: RequestInit & { skipAuth?: boolean } = {},
  ): Promise<{ data: T; meta?: unknown }> {
    const base = getBaseUrl();
    const url = path.startsWith("http") ? path : `${base}${path}`;
    const headers = new Headers(init.headers);

    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const token = getToken();
    const hadAuthHeader = Boolean(token) && !init.skipAuth;
    if (hadAuthHeader) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(url, { ...init, headers });

    if (res.status === 204) {
      return { data: undefined as T };
    }

    const text = await res.text();
    let json: unknown = undefined;
    if (text) {
      try {
        json = JSON.parse(text) as unknown;
      } catch {
        throw new ApiError("Respuesta inválida del servidor", res.status);
      }
    }

    if (!res.ok) {
      const errMsg =
        typeof json === "object" &&
        json !== null &&
        "error" in json &&
        typeof (json as ApiErrorBody).error === "string"
          ? (json as ApiErrorBody).error!
          : `Error HTTP ${res.status}`;

      if (res.status === 401 && hadAuthHeader) {
        onUnauthorized();
        if (typeof window !== "undefined") {
          window.location.assign("/login");
        }
      }

      throw new ApiError(errMsg, res.status, json);
    }

    if (
      typeof json !== "object" ||
      json === null ||
      !("data" in json) ||
      (json as ApiEnvelope<unknown>).data === undefined
    ) {
      throw new ApiError("Formato de respuesta inesperado", res.status, json);
    }

    const envelope = json as ApiEnvelope<T> & { meta?: unknown };
    return { data: envelope.data, meta: envelope.meta };
  }

  return { request, getBaseUrl };
}

export type ApiClient = ReturnType<typeof createApiClient>;
