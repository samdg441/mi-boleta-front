export function toDateTimeLocalValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromDateTimeLocalToIso(value: string): string {
  const d = new Date(value);
  return d.toISOString();
}

export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

/** Días calendario hasta la fecha del sorteo (0 = hoy, negativo = ya pasó). */
export function daysUntilSorteo(iso: string): number {
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return 0;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTarget = new Date(target);
  startOfTarget.setHours(0, 0, 0, 0);
  const diffMs = startOfTarget.getTime() - startOfToday.getTime();
  return Math.round(diffMs / 86_400_000);
}

export function formatDaysUntilLabel(iso: string): string {
  const days = daysUntilSorteo(iso);
  if (days < 0) return "Sorteo pasado";
  if (days === 0) return "Hoy";
  if (days === 1) return "Mañana";
  return `Faltan ${days} días`;
}

export function isSorteoUrgent(iso: string): boolean {
  const days = daysUntilSorteo(iso);
  return days >= 0 && days <= 3;
}
