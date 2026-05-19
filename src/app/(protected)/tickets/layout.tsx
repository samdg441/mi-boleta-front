"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/presentation/stores/auth-store";
import { useAuthHydration } from "@/presentation/hooks/use-auth-hydration";
import { Spinner } from "@/presentation/components/ui/feedback";

/** Los administradores solo consultan el sistema; no gestionan boletas propias. */
export default function TicketsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthHydration();

  useEffect(() => {
    if (!hydrated) return;
    if (user?.role === "admin") router.replace("/admin");
  }, [hydrated, user, router]);

  if (!hydrated || user?.role === "admin") {
    return <Spinner label="Redirigiendo…" />;
  }

  return <>{children}</>;
}
