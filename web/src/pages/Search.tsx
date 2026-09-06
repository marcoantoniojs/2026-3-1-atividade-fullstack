import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { PostList } from "../components/PostList";
import { Icon } from "../components/Icon";
import { usePostList } from "../hooks/usePostList";
import ui from "../styles/ui.module.css";
import styles from "./page.module.css";

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const term = searchParams.get("q") ?? "";
  const [draft, setDraft] = useState(term);
  const feed = usePostList("/posts", { q: term });

  useEffect(() => {
    setDraft(term);
  }, [term]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSearchParams(draft.trim() ? { q: draft.trim() } : {});
  };

  return (
    <>
      <h1 className={styles.title}>Pesquisar</h1>

      <form onSubmit={submit} style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
        <input
          className={ui.input}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Buscar por texto, nome ou @usuário"
          aria-label="Termo de busca"
        />
        <button className={`${ui.button} ${ui.primary}`} type="submit" style={{ width: "auto" }}>
          <Icon name="search" />
        </button>
      </form>

      {term && (
        <p className={styles.subtitle}>
          Resultados para <strong>{term}</strong>
        </p>
      )}

      <PostList
        {...feed}
        emptyMessage={term ? "Nenhuma publicação encontrada." : "Digite algo para pesquisar."}
        onLoadMore={feed.loadMore}
      />
    </>
  );
}
