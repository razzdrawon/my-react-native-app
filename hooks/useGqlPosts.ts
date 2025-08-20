import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_POSTS } from '../graphql/queries';
import { Post } from '../types/posts';

const LIMIT = 10;

type PostsResponse = {
  posts: {
    data: Array<{ id: string; title: string; body: string; user: { id: string } }>;
    meta: { totalCount: number };
  };
};

export const useGqlPosts = () => {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, error, fetchMore, refetch } = useQuery<PostsResponse>(GET_POSTS, {
    variables: { page: 1, limit: LIMIT },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data?.posts?.data) {
      const mapped = data.posts.data.map(p => ({
        id: Number(p.id),
        title: p.title,
        body: p.body,
        userId: Number(p.user.id),
      }));
      setItems(mapped);
      setHasMore(mapped.length < (data.posts.meta?.totalCount ?? mapped.length));
    }
  }, [data]);

  const fetchNextPage = useCallback(async () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    const res = await fetchMore({ variables: { page: nextPage, limit: LIMIT } });
    const newData = res.data?.posts?.data ?? [];
    const mapped = newData.map((p: any) => ({
      id: Number(p.id),
      title: p.title,
      body: p.body,
      userId: Number(p.user.id),
    }));
    setItems(prev => [...prev, ...mapped]);
    setPage(nextPage);
    const total = res.data?.posts?.meta?.totalCount ?? items.length + mapped.length;
    setHasMore(items.length + mapped.length < total);
  }, [fetchMore, hasMore, items.length, loading, page]);

  const refreshing = loading && page === 1;
  const loadingMore = loading && page > 1;

  const refresh = useCallback(async () => {
    setPage(1);
    const res = await refetch({ page: 1, limit: LIMIT });
    const newData = res.data?.posts?.data ?? [];
    const mapped = newData.map((p: any) => ({
      id: Number(p.id),
      title: p.title,
      body: p.body,
      userId: Number(p.user.id),
    }));
    setItems(mapped);
    const total = res.data?.posts?.meta?.totalCount ?? mapped.length;
    setHasMore(mapped.length < total);
  }, [refetch]);

  return {
    posts: items,
    loading,
    error: error?.message ?? null,
    hasMore,
    refreshing,
    loadingMore,
    fetchNextPage,
    refetch: refresh,
  };
};
