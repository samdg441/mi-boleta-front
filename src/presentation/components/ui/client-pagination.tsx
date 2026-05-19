"use client";

import { PaginationBar } from "@/presentation/components/ui/pagination";
import { paginate } from "@/presentation/lib/paginate";

export function ClientPaginationFooter({
  total,
  page,
  pageSize,
  onPageChange,
}: {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  if (total === 0) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <PaginationBar
      page={page}
      totalPages={totalPages}
      total={total}
      pageSize={pageSize}
      onPageChange={onPageChange}
    />
  );
}

export { paginate };
