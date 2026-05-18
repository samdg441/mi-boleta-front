import Link from "next/link";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Link>, "className"> & {
  className?: string;
};

export function GradientLink({ className = "", ...props }: Props) {
  return (
    <Link
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-500/25 transition hover:from-orange-600 hover:to-orange-700 hover:shadow-lg active:scale-[0.98] ${className}`}
      {...props}
    />
  );
}
