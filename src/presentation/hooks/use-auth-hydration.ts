"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/presentation/stores/auth-store";

export function useAuthHydration(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const persist = useAuthStore.persist;
    const maybeHas = persist as { hasHydrated?: () => boolean };
    if (typeof maybeHas.hasHydrated === "function" && maybeHas.hasHydrated()) {
      useAuthStore.getState().syncUserFromToken();
      setReady(true);
      return;
    }

    const onReady = () => {
      useAuthStore.getState().syncUserFromToken();
      setReady(true);
    };

    const unsub =
      typeof persist.onFinishHydration === "function"
        ? persist.onFinishHydration(onReady)
        : undefined;

    const fallback = window.setTimeout(onReady, 300);
    return () => {
      unsub?.();
      window.clearTimeout(fallback);
    };
  }, []);

  return ready;
}
