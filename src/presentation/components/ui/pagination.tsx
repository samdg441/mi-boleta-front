import { Button } from "@/presentation/components/ui/button";
import { LIST_PAGE_SIZE } from "@/presentation/constants/pagination";

export function PaginationBar({
  page,
  totalPages,
  total,
  onPageChange,
  pageSize = LIST_PAGE_SIZE,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <footer className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
      <p>
        {total === 0 ? (
          "Sin registros"
        ) : (
          <>
            Mostrando{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {from}–{to}
            </span>{" "}
            de <span className="font-semibold text-slate-800 dark:text-slate-200">{total}</span> ·
            Página <span className="font-semibold text-slate-800 dark:text-slate-200">{page}</span>{" "}
            de{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{totalPages}</span>
          </>
        )}
      </p>
      <div className="flex shrink-0 gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Anterior
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
        </Button>
      </div>
    </footer>
  );
}
