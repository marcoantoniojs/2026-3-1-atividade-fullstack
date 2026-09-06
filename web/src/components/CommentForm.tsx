import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Icon } from "./Icon";
import styles from "./CommentForm.module.css";

type CommentFormProps = {
  placeholder?: string;
  autoFocus?: boolean;
  onSubmit: (content: string) => Promise<void>;
};

export function CommentForm({ placeholder = "Escreva um comentário...", autoFocus, onSubmit }: CommentFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  if (!user) {
    return (
      <p className={styles.signIn}>
        <Link to="/login">Entre na sua conta</Link> para comentar.
      </p>
    );
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (!content.trim()) {
      return;
    }

    setSending(true);

    try {
      await onSubmit(content.trim());
      setContent("");
    } finally {
      setSending(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <textarea
        className={styles.input}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={placeholder}
        maxLength={280}
        rows={1}
        autoFocus={autoFocus}
        aria-label={placeholder}
      />
      <button className={styles.submit} type="submit" disabled={sending || !content.trim()} aria-label="Publicar comentário">
        <Icon name="send" />
      </button>
    </form>
  );
}
