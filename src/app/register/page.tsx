"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles } from "lucide-react";
import { authRepository } from "@/infrastructure/di/container";
import { ApiError } from "@/infrastructure/http/api-error";
import { registerSchema } from "@/presentation/validation/forms";
import { useAuthStore } from "@/presentation/stores/auth-store";
import { useAuthHydration } from "@/presentation/hooks/use-auth-hydration";
import { getHomePathForUser } from "@/presentation/lib/auth-routes";
import { AuthSplitLayout } from "@/presentation/components/layout/auth-split-layout";
import { Button } from "@/presentation/components/ui/button";
import { FieldError, FieldLabel, TextInput } from "@/presentation/components/ui/field";

type FormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthHydration();

  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  useEffect(() => {
    if (!hydrated) return;
    if (token) router.replace(getHomePathForUser(user));
  }, [hydrated, token, user, router]);

  async function onSubmit(values: FormValues) {
    try {
      await authRepository.register(values);
      const session = await authRepository.login({
        email: values.email,
        password: values.password,
      });
      setSession(session.token, session.user);
      router.replace(getHomePathForUser(session.user));
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
    <AuthSplitLayout
      title="Crea tu cuenta"
      subtitle="En segundos podrás registrar boletas, fechas y estados sin perder el hilo."
    >
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div>
          <FieldLabel htmlFor="name">Nombre completo</FieldLabel>
          <TextInput id="name" autoComplete="name" {...form.register("name")} />
          <FieldError message={form.formState.errors.name?.message} />
        </div>
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
            autoComplete="new-password"
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
          {form.formState.isSubmitting ? "Creando cuenta…" : "Registrarme"}
          {!form.formState.isSubmitting ? <Sparkles className="h-4 w-4" aria-hidden /> : null}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        ¿Ya tienes cuenta?{" "}
        <Link
          className="font-bold text-orange-600 underline decoration-orange-200 underline-offset-4 hover:text-orange-700"
          href="/login"
        >
          Inicia sesión
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
