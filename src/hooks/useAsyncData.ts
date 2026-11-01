import { useCallback, useEffect, useState } from 'react';

interface AsyncState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useAsyncData<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, error: null, loading: true });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setState((previous) => ({ ...previous, loading: true, error: null }));

    loader()
      .then((data) => {
        if (active) setState({ data, error: null, loading: false });
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.';
        setState({ data: null, error: message, loading: false });
      });

    return () => {
      active = false;
    };
    // The loader is an inline closure; callers control re-runs through deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);

  return { ...state, reload };
}
