import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { request } from "../lib/api";
import { Icon } from "./Icon";
import type { Rating } from "../lib/types";
import styles from "./StarRating.module.css";

const VALUES = [1, 2, 3];

type StarRatingProps = {
  postId: string;
  rating: Rating;
  onChange: (rating: Rating) => void;
};

export function StarRating({ postId, rating, onChange }: StarRatingProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const submit = async (value: number) => {
    if (!user) {
      navigate("/login", { state: { from: `/post/${postId}` } });
      return;
    }

    setSaving(true);

    try {
      const updated =
        rating.myValue === value
          ? await request<Rating>(`/posts/${postId}/rating`, { method: "DELETE" })
          : await request<Rating>(`/posts/${postId}/rating`, { method: "PUT", body: { value } });
      onChange(updated);
    } catch {
      /* mantém a avaliação atual quando a requisição falha */
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <span className={styles.summary} title={`${rating.count} avaliação(ões)`}>
        <Icon className={styles.summaryStar} name="star" size={18} filled />
        {rating.count > 0 ? rating.average : 0}
      </span>

      <div className={styles.chips}>
        {VALUES.map((value) => (
          <button
            key={value}
            type="button"
            className={`${styles.chip} ${rating.myValue === value ? styles.chipActive : ""}`}
            disabled={saving}
            onClick={() => submit(value)}
            title={
              !user
                ? "Entre para avaliar"
                : rating.myValue === value
                  ? "Remover a sua avaliação"
                  : `Avaliar com ${value} estrela(s)`
            }
          >
            {value}
            <Icon
              className={rating.myValue !== null && value <= rating.myValue ? styles.starOn : styles.star}
              name="star"
              size={14}
              filled
            />
          </button>
        ))}
      </div>
    </div>
  );
}
