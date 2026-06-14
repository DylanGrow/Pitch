import { useState, useEffect, useCallback, useRef } from 'react';

const REFRESH_INTERVAL_MS = 2 * 60 * 1000;

interface UseAutoRefreshOptions<T> { fetcher: () => Promise<T>; enabled?: boolean; }
interface UseAutoRefreshResult<T> {
  data: T | null; error: string | null; loading: boolean;
  lastRefresh: Date | null; refresh: () => Promise<void>; isRefreshing: boolean;
}

export function useAutoRefresh<T>({ fetcher, enabled = true }: UseAutoRefreshOptions<T>): UseAutoRefreshResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMounted = useRef(true);

  const doFetch = useCallback(async (isBackground = false) => {
    if (!isMounted.current) return;
    if (isBackground) setIsRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (isMounted.current) { setData(result); setLastRefresh(new Date()); setError(null); }
    } catch (err) {
      if (isMounted.current) setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      if (isMounted.current) { setLoading(false); setIsRefreshing(false); }
    }
  }, [fetcher]);

  useEffect(() => { if (enabled) void doFetch(false); }, [doFetch, enabled]);

  useEffect(() => {
    if (!enabled) return;
    const startTimer = () => {
      timerRef.current = setInterval(() => { if (!document.hidden) void doFetch(true); }, REFRESH_INTERVAL_MS);
    };
    const handleVisibility = () => {
      if (!document.hidden) {
        void doFetch(true);
        if (timerRef.current) clearInterval(timerRef.current);
        startTimer();
      }
    };
    startTimer();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => { if (timerRef.current) clearInterval(timerRef.current); document.removeEventListener('visibilitychange', handleVisibility); };
  }, [doFetch, enabled]);

  useEffect(() => { return () => { isMounted.current = false; }; }, []);

  const refresh = useCallback(async () => { await doFetch(true); }, [doFetch]);
  return { data, error, loading, lastRefresh, refresh, isRefreshing };
}
