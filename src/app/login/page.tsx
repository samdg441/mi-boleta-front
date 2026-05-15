"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authRepository } from "@/infrastructure/di/container";
import { ApiError } from "@/infrastructure/http/api-error";
import { loginSchema } from "@/presentation/validation/forms";
import type { z } from "zod";
import { useAuthStore } from "@/presentation/stores/auth-store";
import { useAuthHydration } from "@/presentation/hooks/use-auth-hydration";
import { Button } from "@/presentation/components/ui/button";
import { FieldError, TextInput } from "@/presentation/components/ui/field";

type FormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthHydration();

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (!hydrated) return;
    if (token) router.replace("/dashboard");
  }, [hydrated, token, router]);

  async function onSubmit(values: FormValues) {
    try {
      const session = await authRepository.login(values);
      setSession(session.token, session.user);
      router.replace("/dashboard");
    } catch (e) {
      if (e instanceof ApiError) {
        form.setError("root", { message: e.message });
        return;
      }
      form.setError("root", { message: "No se pudo iniciar sesión. Intenta de nuevo." });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Mi Boleta</h1>
          <p className="mt-1 text-sm text-slate-600">Inicia sesión para continuar</p>
        </div>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <TextInput id="email" type="email" autoComplete="email" {...form.register("email")} />
            <FieldError message={form.formState.errors.email?.message} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="password">
              Contraseña
            </label>
            <TextInput
              id="password"
              type="password"
              autoComplete="current-password"
              {...form.register("password")}
            />
            <FieldError message={form.formState.errors.password?.message} />
          </div>

          <FieldError message={form.formState.errors.root?.message} />

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Entrando…" : "Entrar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          ¿No tienes cuenta?{" "}
          <Link className="font-semibold text-brand-primary hover:underline" href="/register">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
