"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { loadAllMyTickets } from "@/presentation/hooks/load-all-tickets";
import type { Ticket } from "@/domain/entities/ticket";
import { ApiError } from "@/infrastructure/http/api-error";
import { Card } from "@/presentation/components/ui/card";
import { DashboardSkeleton } from "@/presentation/components/ui/skeleton";
import { Button } from "@/presentation/components/ui/button";
import { GradientLink } from "@/presentation/components/ui/gradient-link";
import { PageHeader } from "@/presentation/components/layout/page-header";
import { DashboardOverview } from "@/presentation/components/dashboard/dashboard-overview";
import { useAuthStore } from "@/presentation/stores/auth-store";
import { useAuthHydration } from "@/presentation/hooks/use-auth-hydration";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthHydration();

  useEffect(() => {
    if (!hydrated) return;
    if (user?.role === "admin") router.replace("/admin");
  }, [hydrated, user, router]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await loadAllMyTickets();
        if (cancelled) return;
        setTickets(res.tickets);
        setTotal(res.total);
      } catch (e) {
        if (cancelled) return;
        const msg =
          e instanceof ApiError ? e.message : "No se pudo cargar el dashboard.";
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <Card title="Dashboard">
        <p className="text-sm font-medium text-red-600">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-8">
      <PageHeader
        badge="Panel principal"
        icon={Sparkles}
        title="Hola, aquí va tu suerte en orden"
        description="Visualiza totales, lo que viene en el calendario, pendientes por resultado y tu historial completo."
        actions={<GradientLink href="/tickets/new">Nueva boleta</GradientLink>}
      />

      <DashboardOverview tickets={tickets} total={total} />
    </div>
  );
}
