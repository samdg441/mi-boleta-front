import { toast as sonner } from "sonner";
import type { Theme } from "@/presentation/stores/theme-store";

export const toast = {
  success: (message: string) => sonner.success(message),
  error: (message: string) => sonner.error(message),
};

export function notifyThemeChange(theme: Theme) {
  toast.success(theme === "dark" ? "Modo oscuro activado" : "Modo claro activado");
}

export function notifyLogin() {
  toast.success("Sesión iniciada correctamente");
}

export function notifyRegister() {
  toast.success("Cuenta creada. ¡Bienvenido!");
}

export function notifyLogout() {
  toast.success("Sesión cerrada");
}

export function notifyTicketCreated(title: string) {
  toast.success(`Boleta "${title}" creada`);
}

export function notifyTicketUpdated(title: string) {
  toast.success(`Boleta "${title}" actualizada`);
}

export function notifyTicketDeleted() {
  toast.success("Boleta eliminada");
}

export function notifyApiError(message: string) {
  toast.error(message);
}
