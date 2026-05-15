import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "El email es obligatorio").email("El email no es válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(80, "El nombre no puede superar 80 caracteres"),
  email: z.string().min(1, "El email es obligatorio").email("El email no es válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

const gameTypeEnum = z.enum([
  "Lotería",
  "Rifa",
  "Sorteo",
  "Boleta",
  "Juego ocasional",
]);

const statusEnum = z.enum(["Pendiente", "Ganado", "Perdido"]);

export const ticketSchema = z
  .object({
    title: z.string().min(1, "El nombre del sorteo es obligatorio"),
    gameType: gameTypeEnum,
    gameNumber: z.string().optional(),
    gameDate: z.string().min(1, "La fecha del sorteo es obligatoria"),
    amount: z.string().optional(),
    place: z.string().optional(),
    status: statusEnum,
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.amount?.trim()) return;
    const n = Number(data.amount.replace(",", "."));
    if (!Number.isFinite(n) || n < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amount"],
        message: "El monto debe ser un número válido mayor o igual a 0",
      });
    }
  });

export type TicketFormValues = z.infer<typeof ticketSchema>;
