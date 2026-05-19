"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/presentation/stores/auth-store";
import { useAuthHydration } from "@/presentation/hooks/use-auth-hydration";
import { getHomePathForUser } from "@/presentation/lib/auth-routes";
import { Spinner } from "@/presentation/components/ui/feedback";

export default function HomePage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthHydration();

  useEffect(() => {
    if (!hydrated) return;
    router.replace(token ? getHomePathForUser(user) : "/login");
  }, [hydrated, token, user, router]);

  return (
    <div className="min-h-screen bg-brand-cream bg-mesh-light">
      <Spinner label="Cargando…" />
    </div>
  );
}
