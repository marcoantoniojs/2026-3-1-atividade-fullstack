import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { fullDate, relativeTime } from "../lib/format";
import { Avatar } from "./Avatar";
import { CommentForm } from "./CommentForm";
import type { Comment } from "../lib/types";
import styles from "./CommentThread.module.css";

type ThreadProps = {
  comments: Comment[];
  onReply: (parentId: string, content: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
};

function Node({ comment, onReply, onRemove }: { comment: Comment } & Omit<ThreadProps, "comments">) {
  const { user } = useAuth();
  const [replying, setReplying] = useState(false);

  return (
    <li className={styles.node}>
      <div className={styles.header}>
        <Avatar user={comment.author} size={28} />
        <Link className={styles.author} to={`/perfil/${comment.author.username}`}>
          {comment.author.name}
        </Link>
        <span className={styles.handle}>@{comment.author.username}</span>
        <time className={styles.time} dateTime={comment.createdAt} title={fullDate(comment.createdAt)}>
          {relativeTime(comment.createdAt)}
        </time>
      </div>

      <p className={styles.content}>{comment.content}</p>

      <div className={styles.actions}>
        {user && (
          <button className={styles.action} type="button" onClick={() => setReplying((open) => !open)}>
            {replying ? "Cancelar" : "Responder"}
          </button>
        )}
        {user?.id === comment.author.id && (
          <button className={styles.action} type="button" onClick={() => onRemove(comment.id)}>
            Apagar
          </button>
        )}
      </div>

      {replying && (
        <div className={styles.replyForm}>
          <CommentForm
            autoFocus
            placeholder={`Responder ${comment.author.name}...`}
            onSubmit={async (content) => {
              await onReply(comment.id, content);
              setReplying(false);
            }}
          />
        </div>
      )}

      {comment.replies.length > 0 && (
        <ul className={styles.replies}>
          {comment.replies.map((reply) => (
            <Node key={reply.id} comment={reply} onReply={onReply} onRemove={onRemove} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function CommentThread({ comments, onReply, onRemove }: ThreadProps) {
  return (
    <ul className={styles.list}>
      {comments.map((comment) => (
        <Node key={comment.id} comment={comment} onReply={onReply} onRemove={onRemove} />
      ))}
    </ul>
  );
}
