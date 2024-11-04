import { useEffect, useState, useMemo } from "react";

interface UseFetchDataOptions<T, P extends any[]> {
  shouldFetch?: boolean;
  params?: P;
}

interface UseFetchDataResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

export function useFetchData<T, P extends any[] = []> (
  fetchFunction: (...args: P) => Promise<T[]>,
  options: UseFetchDataOptions<T, P> = { shouldFetch: true, params: [] as unknown as P }
): UseFetchDataResult<T> {
  const { shouldFetch = true, params = [] as unknown as P } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const memoizedParams = useMemo(() => JSON.stringify(params), [params]);

  useEffect(() => {
    const fetchData = async () => {
      if (!shouldFetch) return;

      setLoading(true);
      setError(null);
      try {
        const result = await fetchFunction(...(JSON.parse(memoizedParams) as P));
        setData(result);
      } catch (err) {
        setError("Error al obtener los datos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction, shouldFetch, memoizedParams]);

  return { data, loading, error };
}
