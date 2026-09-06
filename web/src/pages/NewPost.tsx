import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, request } from "../lib/api";
import type { Post } from "../lib/types";
import ui from "../styles/ui.module.css";
import styles from "./page.module.css";

const LIMIT = 280;

export function NewPost() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSending(true);

    try {
      await request<Post>("/posts", { method: "POST", body: { content: content.trim() } });
      navigate("/meus-posts");
    } catch (cause) {
      const detail = cause instanceof ApiError ? cause.details?.[0]?.message : null;
      setError(detail ?? (cause instanceof Error ? cause.message : "Não foi possível publicar."));
      setSending(false);
    }
  };

  return (
    <>
      <h1 className={styles.title}>Nova publicação</h1>
      <p className={styles.subtitle}>As publicações do Diatinf X são somente de texto.</p>

      {error && <p className={ui.error}>{error}</p>}

      <form onSubmit={submit}>
        <label className={ui.field}>
          <span className={ui.label}>O que está acontecendo?</span>
          <textarea
            className={ui.textarea}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={LIMIT}
            placeholder="Compartilhe uma ideia com a turma..."
            autoFocus
            required
          />
        </label>

        <p className={ui.hint} style={{ marginBottom: "var(--space-4)", textAlign: "right" }}>
          {content.length} / {LIMIT}
        </p>

        <button className={`${ui.button} ${ui.primary}`} type="submit" disabled={sending || !content.trim()}>
          {sending ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </>
  );
}
