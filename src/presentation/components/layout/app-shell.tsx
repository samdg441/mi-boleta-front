"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LineChart,
  LogOut,
  PlusCircle,
  Shield,
  Ticket,
} from "lucide-react";
import { useAuthStore } from "@/presentation/stores/auth-store";
import { getHomePathForUser } from "@/presentation/lib/auth-routes";
import { Button } from "@/presentation/components/ui/button";
import { ThemeToggle } from "@/presentation/components/ui/theme-toggle";
import { LogoutOverlay } from "@/presentation/components/layout/logout-overlay";
import { PageTransition } from "@/presentation/components/layout/page-transition";
import { notifyLogout } from "@/presentation/lib/toast";

const userLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tickets", label: "Mis boletas", icon: Ticket },
  { href: "/tickets/new", label: "Nueva boleta", icon: PlusCircle },
] as const;

const adminLinks = [
  { href: "/admin", label: "Panel admin", icon: Shield },
  { href: "/admin/graficas", label: "Gráficas", icon: LineChart },
] as const;

function isNavActive(href: string, pathname: string): boolean {
  if (href === "/tickets/new") return pathname === "/tickets/new";
  if (href === "/tickets") {
    if (pathname === "/tickets/new") return false;
    return pathname === "/tickets" || pathname.startsWith("/tickets/");
  }
  if (href === "/admin") return pathname === "/admin";
  if (href === "/admin/graficas") {
    return pathname === "/admin/graficas" || pathname.startsWith("/admin/graficas/");
  }
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "?";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return `${a}${b}`.toUpperCase();
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);
  const homePath = getHomePathForUser(user);
  const links = user?.role === "admin" ? adminLinks : userLinks;
  const [loggingOut, setLoggingOut] = useState(false);

  function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    window.setTimeout(() => {
      clearSession();
      notifyLogout();
      router.replace("/login");
    }, 550);
  }

  return (
    <div className="relative min-h-screen bg-brand-cream bg-mesh-light text-slate-900 dark:bg-slate-950 dark:bg-mesh-dark dark:text-slate-100">
      {loggingOut ? <LogoutOverlay /> : null}

      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-navy/95 shadow-soft backdrop-blur-md">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent" />
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 transition duration-300 hover:opacity-95">
            <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-900/40 ring-2 ring-white/10 transition duration-300 hover:scale-105">
              <Ticket className="h-5 w-5 text-white" strokeWidth={2.2} aria-hidden />
            </div>
            <div className="min-w-0">
              <Link
                href={homePath}
                className="text-lg font-extrabold tracking-tight text-white transition hover:text-orange-100"
              >
                Mi Boleta
              </Link>
              <p className="truncate text-sm text-slate-400">{user?.name}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <nav className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 p-1.5 shadow-innerGlow backdrop-blur-sm">
              {links.map((l) => {
                const Icon = l.icon;
                const active = isNavActive(l.href, pathname);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                      active
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-900/30"
                        : "text-slate-200 hover:translate-y-[-1px] hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                    <span className="hidden sm:inline">{l.label}</span>
                    <span className="sm:hidden">{l.label.split(" ")[0]}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3 sm:pl-1">
              <ThemeToggle variant="header" />
              <div
                className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs font-bold text-white transition duration-200 hover:scale-105 sm:flex"
                title={user?.name}
              >
                {user?.name ? initials(user.name) : "?"}
              </div>
              <Button
                variant="ghost"
                className="gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-100 transition-all duration-200 hover:scale-[1.02] hover:bg-white/10 hover:text-white active:scale-95"
                onClick={logout}
                disabled={loggingOut}
              >
                <LogOut className={`h-4 w-4 ${loggingOut ? "animate-pulse" : ""}`} aria-hidden />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 max-w-3xl rounded-full bg-orange-400/10 blur-3xl" />
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
