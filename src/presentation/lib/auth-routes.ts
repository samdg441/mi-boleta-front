import type { User, UserRole } from "@/domain/entities/user";

type JwtPayload = {
  role?: UserRole;
  userId?: string;
  email?: string;
  name?: string;
};

/** Ruta principal tras login según el rol. */
export function getHomePathForRole(role: UserRole | undefined): "/admin" | "/dashboard" {
  return role === "admin" ? "/admin" : "/dashboard";
}

export function getHomePathForUser(user: Pick<User, "role"> | null | undefined): "/admin" | "/dashboard" {
  return getHomePathForRole(user?.role);
}

/** Lee el payload del JWT (solo UI; la API valida en servidor). */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = atob(padded);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/** Alinea el rol guardado en Zustand con el del token (útil tras promover a admin y volver a entrar). */
export function mergeUserRoleFromToken(user: User, token: string): User {
  const payload = decodeJwtPayload(token);
  if (payload?.role && payload.role !== user.role) {
    return { ...user, role: payload.role };
  }
  return user;
}
