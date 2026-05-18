"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { authRepository } from "@/infrastructure/di/container";
import { ApiError } from "@/infrastructure/http/api-error";
import { loginSchema } from "@/presentation/validation/forms";
import type { z } from "zod";
import { useAuthStore } from "@/presentation/stores/auth-store";
import { useAuthHydration } from "@/presentation/hooks/use-auth-hydration";
import { AuthSplitLayout } from "@/presentation/components/layout/auth-split-layout";
import { Button } from "@/presentation/components/ui/button";
import { FieldError, FieldLabel, TextInput } from "@/presentation/components/ui/field";

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
    <AuthSplitLayout title="Bienvenido de nuevo" subtitle="Ingresa tus credenciales para ver tus boletas y sorteos.">
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <TextInput id="email" type="email" autoComplete="email" {...form.register("email")} />
          <FieldError message={form.formState.errors.email?.message} />
        </div>
        <div>
          <FieldLabel htmlFor="password">Contraseña</FieldLabel>
          <TextInput
            id="password"
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
          />
          <FieldError message={form.formState.errors.password?.message} />
        </div>

        {form.formState.errors.root?.message ? (
          <div className="rounded-xl border border-red-100 bg-red-50/70 px-3 py-2">
            <FieldError message={form.formState.errors.root.message} />
          </div>
        ) : null}

        <Button type="submit" className="w-full py-3 text-base" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Entrando…" : "Entrar"}
          {!form.formState.isSubmitting ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        ¿No tienes cuenta?{" "}
        <Link
          className="font-bold text-orange-600 underline decoration-orange-200 underline-offset-4 hover:text-orange-700"
          href="/register"
        >
          Regístrate
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
