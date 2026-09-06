import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PostCard } from "../components/PostCard";
import { CommentForm } from "../components/CommentForm";
import { CommentThread } from "../components/CommentThread";
import { Icon } from "../components/Icon";
import { request } from "../lib/api";
import type { Comment, Post } from "../lib/types";
import ui from "../styles/ui.module.css";
import styles from "./page.module.css";

export function PostDetail() {
  const { id = "" } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setComments(await request<Comment[]>(`/posts/${id}/comments`));
  }, [id]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    Promise.all([request<Post>(`/posts/${id}`), request<Comment[]>(`/posts/${id}/comments`)])
      .then(([loadedPost, loadedComments]) => {
        if (active) {
          setPost(loadedPost);
          setComments(loadedComments);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Não foi possível carregar a publicação.");
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
  }, [id]);

  const bumpCount = (delta: number) => {
    setPost((current) => (current ? { ...current, commentCount: current.commentCount + delta } : current));
  };

  const comment = async (content: string) => {
    await request(`/posts/${id}/comments`, { method: "POST", body: { content } });
    await loadComments();
    bumpCount(1);
  };

  const reply = async (parentId: string, content: string) => {
    await request(`/comments/${parentId}/replies`, { method: "POST", body: { content } });
    await loadComments();
    bumpCount(1);
  };

  const remove = async (commentId: string) => {
    await request(`/comments/${commentId}`, { method: "DELETE" });
    await loadComments();
  };

  if (loading) {
    return <p className={styles.subtitle}>Carregando publicação...</p>;
  }

  if (error || !post) {
    return <p className={ui.error}>{error ?? "Publicação não encontrada."}</p>;
  }

  return (
    <>
      <Link className={styles.back} to="/">
        <Icon name="back" size={16} />
        Voltar ao feed
      </Link>

      <PostCard post={post} />

      <h2 className={styles.title} style={{ marginTop: "var(--space-6)", fontSize: "var(--text-xl)" }}>
        Comentários ({post.commentCount})
      </h2>

      <div style={{ marginBottom: "var(--space-4)" }}>
        <CommentForm onSubmit={comment} />
      </div>

      {comments.length === 0 ? (
        <p className={styles.subtitle}>Ainda não há comentários. Seja o primeiro.</p>
      ) : (
        <CommentThread comments={comments} onReply={reply} onRemove={remove} />
      )}
    </>
  );
}
