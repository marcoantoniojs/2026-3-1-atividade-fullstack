import { usePostList } from "../hooks/usePostList";
import { PostList } from "../components/PostList";
import styles from "./page.module.css";

export function Feed() {
  const feed = usePostList("/posts");

  return (
    <>
      <h1 className={styles.title}>Feed Global</h1>
      <PostList
        {...feed}
        emptyMessage="Ainda não há publicações por aqui."
        onLoadMore={feed.loadMore}
        onRemoved={feed.removePost}
      />
    </>
  );
}
