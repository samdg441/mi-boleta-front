/**
 * La API admin usa un único parámetro `q` (OR en título, número, nombre y email).
 * Unimos los campos separados del formulario en una sola búsqueda.
 */
export function buildAdminSearchQuery(gameNumber: string, ownerOrTitle: string): string | undefined {
  const num = gameNumber.trim();
  const name = ownerOrTitle.trim();
  if (num && name) return `${name} ${num}`;
  return num || name || undefined;
}
