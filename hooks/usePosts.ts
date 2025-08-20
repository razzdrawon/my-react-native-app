import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiResponse, Post } from '../types/posts';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';
const LIMIT = 10;

export const usePosts = () => {
  const [state, setState] = useState<ApiResponse<Post[]>>({
    data: null,
    loading: false,
    error: null,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const abortRef = useRef<AbortController | null>(null);

  const fetchPage = useCallback(
    async (start: number, append: boolean) => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        if (append) {
          setLoadingMore(true);
        } else if (start === 0 && !refreshing) {
          setState(prev => ({ ...prev, loading: true, error: null }));
        }

        const res = await fetch(
          `${API_BASE_URL}/posts?_start=${start}&_limit=${LIMIT}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const page: Post[] = await res.json();

        setState(prev => {
          const prevData = append && prev.data ? prev.data : [];
          const nextData = append ? [...prevData, ...page] : page;
          return { data: nextData, loading: false, error: null };
        });

        setHasMore(page.length === LIMIT);
      } catch (err) {
        if ((err as any)?.name === 'AbortError') return;
        setState(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'An error occurred',
        }));
      } finally {
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [refreshing]
  );

  const refetch = useCallback(async () => {
    setRefreshing(true);
    await fetchPage(0, false);
  }, [fetchPage]);

  const fetchNextPage = useCallback(async () => {
    if (loadingMore || state.loading || refreshing || !hasMore) return;
    const start = state.data?.length ?? 0;
    await fetchPage(start, true);
  }, [fetchPage, hasMore, loadingMore, refreshing, state.data, state.loading]);

  useEffect(() => {
    fetchPage(0, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    posts: state.data,
    loading: state.loading,
    error: state.error,
    refreshing,
    loadingMore,
    hasMore,
    refetch,
    fetchNextPage,
  };
}; 