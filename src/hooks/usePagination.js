import { useState, useCallback } from 'react';

export default function usePagination(initialLimit = 10) {
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);

  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const reset = useCallback(() => setPage(1), []);

  return { page, limit, setPage, nextPage, prevPage, reset };
}
