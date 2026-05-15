import type {
  AuthRepository,
  AuthSession,
  LoginInput,
  RegisterInput,
} from "@/domain/repositories/auth.repository";
import type { User } from "@/domain/entities/user";
import type { ApiClient } from "../http/api-client";

export class AuthApiRepository implements AuthRepository {
  constructor(private readonly api: ApiClient) {}

  async register(input: RegisterInput): Promise<User> {
    const { data } = await this.api.request<User>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
      skipAuth: true,
    });
    return data;
  }

  async login(input: LoginInput): Promise<AuthSession> {
    const { data } = await this.api.request<AuthSession>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
      skipAuth: true,
    });
    return data;
  }
}
