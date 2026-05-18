import Link from "next/link";
import { Home, Ticket } from "lucide-react";
import { GradientLink } from "@/presentation/components/ui/gradient-link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
      <div className="pointer-events-none absolute inset-0 bg-mesh-light" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[28rem] -translate-x-1/2 rounded-full bg-orange-400/20 blur-3xl" />

      <div className="relative rounded-3xl border border-slate-200/80 bg-white/85 px-8 py-12 shadow-lift backdrop-blur-xl sm:max-w-lg sm:px-12">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30">
          <Ticket className="h-8 w-8 text-white" strokeWidth={2} aria-hidden />
        </div>
        <p className="text-xs font-extrabold uppercase tracking-[0.35em] text-orange-600">404</p>
        <h1 className="mt-3 text-balance text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Esta página no existe
        </h1>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-600">
          Revisa la URL o vuelve al inicio para seguir gestionando tus boletas.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <GradientLink href="/" className="gap-2">
            <Home className="h-4 w-4" aria-hidden />
            Ir al inicio
          </GradientLink>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            Ir a login
          </Link>
        </div>
      </div>
    </div>
  );
}
