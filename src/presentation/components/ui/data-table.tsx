import type { ReactNode } from "react";

export const dataTableShellClass =
  "overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800";

export const dataTableHeadClass =
  "bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/90 dark:text-slate-300";

export const dataTableBodyClass =
  "divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900";

export const dataTableRowClass =
  "transition duration-200 hover:bg-orange-50/40 dark:hover:bg-orange-950/25";

export function DataTableShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${dataTableShellClass} ${className}`}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function DataTableRow({
  children,
  index = 0,
  className = "",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <tr
      className={`${dataTableRowClass} animate-fade-in-up ${className}`}
      style={{ animationDelay: `${Math.min(index, 12) * 45}ms`, animationFillMode: "both" }}
    >
      {children}
    </tr>
  );
}
