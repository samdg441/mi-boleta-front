import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-primary text-white hover:bg-brand-primary-hover disabled:opacity-60",
  secondary:
    "bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-60",
  ghost: "bg-transparent text-slate-800 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-60",
};

export function Button({
  className = "",
  variant = "primary",
  type = "button",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
