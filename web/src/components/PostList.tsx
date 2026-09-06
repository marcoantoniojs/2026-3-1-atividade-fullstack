import { PostCard } from "./PostCard";
import type { Post } from "../lib/types";
import ui from "../styles/ui.module.css";
import styles from "./PostList.module.css";

type PostListProps = {
  posts: Post[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  emptyMessage: string;
  onLoadMore: () => void;
  onRemoved?: (id: string) => void;
};

export function PostList({
  posts,
  loading,
  loadingMore,
  error,
  hasMore,
  emptyMessage,
  onLoadMore,
  onRemoved,
}: PostListProps) {
  if (loading) {
    return <p className={styles.state}>Carregando publicações...</p>;
  }

  if (error) {
    return <p className={ui.error}>{error}</p>;
  }

  if (posts.length === 0) {
    return <p className={styles.state}>{emptyMessage}</p>;
  }

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} preview={post.firstComment} onRemoved={onRemoved} />
      ))}

      {hasMore && (
        <button className={styles.more} type="button" onClick={onLoadMore} disabled={loadingMore}>
          {loadingMore ? "Carregando..." : "Carregar mais"}
        </button>
      )}
    </>
  );
}
