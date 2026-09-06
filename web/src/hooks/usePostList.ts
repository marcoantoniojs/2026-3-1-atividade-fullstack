import { useCallback, useEffect, useState } from "react";
import { request } from "../lib/api";
import type { Page, Post } from "../lib/types";

type Query = Record<string, string | number | undefined | null>;

export function usePostList(path: string, query: Query = {}) {
  const key = JSON.stringify(query);
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    request<Page<Post>>(path, { query: JSON.parse(key) as Query })
      .then((page) => {
        if (active) {
          setPosts(page.items);
          setCursor(page.nextCursor);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Não foi possível carregar as publicações.");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [path, key]);

  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore) {
      return;
    }

    setLoadingMore(true);

    try {
      const page = await request<Page<Post>>(path, { query: { ...(JSON.parse(key) as Query), cursor } });
      setPosts((current) => [...current, ...page.items]);
      setCursor(page.nextCursor);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível carregar mais publicações.");
    } finally {
      setLoadingMore(false);
    }
  }, [path, key, cursor, loadingMore]);

  const removePost = useCallback((id: string) => {
    setPosts((current) => current.filter((post) => post.id !== id));
  }, []);

  return { posts, loading, loadingMore, error, hasMore: cursor !== null, loadMore, removePost };
}
