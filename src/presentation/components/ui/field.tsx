import type { InputHTMLAttributes } from "react";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-red-600">
      <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden />
      {message}
    </p>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-orange-400 focus:ring-4 focus:ring-orange-500/15";

export function TextInput(
  props: InputHTMLAttributes<HTMLInputElement> & { id: string },
) {
  const { className = "", ...rest } = props;
  return <input className={`${inputClass} ${className}`} {...rest} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string },
) {
  const { className = "", ...rest } = props;
  return <textarea className={`${inputClass} min-h-[96px] resize-y ${className}`} {...rest} />;
}

export function SelectInput(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { id: string },
) {
  const { className = "", children, ...rest } = props;
  return (
    <select className={`${inputClass} ${className}`} {...rest}>
      {children}
    </select>
  );
}

export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500"
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
}
