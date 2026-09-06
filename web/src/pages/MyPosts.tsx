import { usePostList } from "../hooks/usePostList";
import { PostList } from "../components/PostList";
import styles from "./page.module.css";

export function MyPosts() {
  const feed = usePostList("/posts/me");

  return (
    <>
      <h1 className={styles.title}>Meus Posts</h1>
      <PostList
        {...feed}
        emptyMessage="Você ainda não publicou nada. Use o botão Novo Post."
        onLoadMore={feed.loadMore}
        onRemoved={feed.removePost}
      />
    </>
  );
}
