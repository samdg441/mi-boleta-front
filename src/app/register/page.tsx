"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authRepository } from "@/infrastructure/di/container";
import { ApiError } from "@/infrastructure/http/api-error";
import { registerSchema } from "@/presentation/validation/forms";
import { useAuthStore } from "@/presentation/stores/auth-store";
import { useAuthHydration } from "@/presentation/hooks/use-auth-hydration";
import { Button } from "@/presentation/components/ui/button";
import { FieldError, TextInput } from "@/presentation/components/ui/field";

type FormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthHydration();

  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  useEffect(() => {
    if (!hydrated) return;
    if (token) router.replace("/dashboard");
  }, [hydrated, token, router]);

  async function onSubmit(values: FormValues) {
    try {
      await authRepository.register(values);
      const session = await authRepository.login({
        email: values.email,
        password: values.password,
      });
      setSession(session.token, session.user);
      router.replace("/dashboard");
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.status === 409) {
          form.setError("email", { message: e.message });
          return;
        }
        form.setError("root", { message: e.message });
        return;
      }
      form.setError("root", { message: "No se pudo completar el registro." });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Crear cuenta</h1>
          <p className="mt-1 text-sm text-slate-600">Registra tus boletas y sorteos</p>
        </div>

        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="name">
              Nombre completo
            </label>
            <TextInput id="name" autoComplete="name" {...form.register("name")} />
            <FieldError message={form.formState.errors.name?.message} />
          </div>
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
              autoComplete="new-password"
              {...form.register("password")}
            />
            <FieldError message={form.formState.errors.password?.message} />
          </div>

          <FieldError message={form.formState.errors.root?.message} />

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creando cuenta…" : "Registrarme"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          ¿Ya tienes cuenta?{" "}
          <Link className="font-semibold text-brand-primary hover:underline" href="/login">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
