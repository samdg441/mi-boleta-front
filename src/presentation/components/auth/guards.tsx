"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/presentation/stores/auth-store";
import { AppShell } from "@/presentation/components/layout/app-shell";
import { Spinner } from "@/presentation/components/ui/feedback";
import { useAuthHydration } from "@/presentation/hooks/use-auth-hydration";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthHydration();

  useEffect(() => {
    if (!hydrated) return;
    if (!token) router.replace("/login");
  }, [hydrated, token, router]);

  if (!hydrated || !token) {
    return (
      <div className="min-h-screen bg-brand-cream bg-mesh-light">
        <Spinner label="Comprobando sesión…" />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthHydration();

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.replace("/login");
      return;
    }
    if (user?.role !== "admin") router.replace("/dashboard");
  }, [hydrated, token, user, router]);

  if (!hydrated || !token || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-brand-cream bg-mesh-light">
        <Spinner label="Verificando permisos…" />
      </div>
    );
  }

  return <>{children}</>;
}
