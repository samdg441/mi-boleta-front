import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-primary">
        404
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Página no encontrada</h1>
      <p className="mt-2 max-w-md text-slate-600">
        La ruta que buscas no existe o fue movida.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-hover"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
