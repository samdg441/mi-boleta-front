"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/presentation/stores/auth-store";
import { Button } from "@/presentation/components/ui/button";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tickets", label: "Mis boletas" },
  { href: "/tickets/new", label: "Nueva boleta" },
  { href: "/admin", label: "Administración" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  function logout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-800 bg-brand-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/dashboard" className="text-lg font-bold tracking-tight">
              Mi Boleta
            </Link>
            <p className="text-sm text-slate-300">
              {user?.name} · {user?.email}
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {links.map((l) => {
              if (l.href === "/admin" && user?.role !== "admin") return null;
              const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active ? "bg-white/10 text-white" : "text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Button
              variant="secondary"
              className="!bg-brand-primary !text-white hover:!bg-brand-primary-hover"
              onClick={logout}
            >
              Salir
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
