"use client";

import { usePathname } from "next/navigation";

/**
 * Re-monta el contenido al cambiar de ruta para disparar la animación de entrada.
 * Usar dentro del layout autenticado (AppShell).
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition-root animate-page-enter">
      {children}
    </div>
  );
}
