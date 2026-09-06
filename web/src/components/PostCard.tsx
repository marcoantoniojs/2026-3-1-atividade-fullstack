import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { request } from "../lib/api";
import { fullDate, relativeTime } from "../lib/format";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";
import { StarRating } from "./StarRating";
import type { CommentPreview, Post, Rating } from "../lib/types";
import styles from "./PostCard.module.css";

type PostCardProps = {
  post: Post;
  preview?: CommentPreview | null;
  onRemoved?: (id: string) => void;
};

export function PostCard({ post, preview, onRemoved }: PostCardProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState<Rating>(post.rating);
  const [removing, setRemoving] = useState(false);

  const remove = async () => {
    setRemoving(true);

    try {
      await request(`/posts/${post.id}`, { method: "DELETE" });
      onRemoved?.(post.id);
    } catch {
      setRemoving(false);
    }
  };

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <Link to={`/perfil/${post.author.username}`}>
          <Avatar user={post.author} />
        </Link>
        <div className={styles.identity}>
          <Link className={styles.name} to={`/perfil/${post.author.username}`}>
            {post.author.name}
          </Link>
          <span className={styles.handle}>@{post.author.username}</span>
        </div>
        <time className={styles.time} dateTime={post.createdAt} title={fullDate(post.createdAt)}>
          {relativeTime(post.createdAt)}
        </time>
      </header>

      <p className={styles.content}>{post.content}</p>

      <div className={styles.footer}>
        <Link className={styles.comment} to={`/post/${post.id}`}>
          <Icon name="comment" size={18} />
          Comentar{post.commentCount > 0 ? ` (${post.commentCount})` : ""}
        </Link>

        {user?.id === post.author.id && onRemoved && (
          <button className={styles.remove} type="button" onClick={remove} disabled={removing} title="Apagar publicação">
            <Icon name="close" size={18} />
          </button>
        )}

        <StarRating postId={post.id} rating={rating} onChange={setRating} />
      </div>

      {preview && (
        <Link className={styles.preview} to={`/post/${post.id}`}>
          <Avatar user={preview.author} size={28} />
          <div className={styles.previewBody}>
            <div>
              <span className={styles.previewAuthor}>{preview.author.name}</span>
              <span className={styles.previewHandle}>@{preview.author.username}</span>
            </div>
            <p className={styles.previewText}>{preview.content}</p>
          </div>
        </Link>
      )}
    </article>
  );
}
