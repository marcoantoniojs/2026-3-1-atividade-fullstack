import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { PostList } from "../components/PostList";
import { usePostList } from "../hooks/usePostList";
import { request } from "../lib/api";
import type { Profile as ProfileType } from "../lib/types";
import ui from "../styles/ui.module.css";
import page from "./page.module.css";
import styles from "./Profile.module.css";

export function Profile() {
  const { username = "" } = useParams();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const feed = usePostList(`/users/${username}/posts`);

  useEffect(() => {
    let active = true;
    setError(null);

    request<ProfileType>(`/users/${username}`)
      .then((loaded) => {
        if (active) {
          setProfile(loaded);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Não foi possível carregar o perfil.");
        }
      });

    return () => {
      active = false;
    };
  }, [username]);

  if (error) {
    return <p className={ui.error}>{error}</p>;
  }

  if (!profile) {
    return <p className={page.subtitle}>Carregando perfil...</p>;
  }

  return (
    <>
      <section className={styles.card}>
        <Avatar user={profile} size={64} />
        <div className={styles.info}>
          <h1 className={styles.name}>{profile.name}</h1>
          <span className={styles.handle}>@{profile.username}</span>
          {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
          <div className={styles.counts}>
            <span>
              <strong>{profile.counts.posts}</strong> publicações
            </span>
            <span>
              <strong>{profile.counts.comments}</strong> comentários
            </span>
          </div>
        </div>
      </section>

      <PostList
        {...feed}
        emptyMessage={`${profile.name} ainda não publicou nada.`}
        onLoadMore={feed.loadMore}
        onRemoved={feed.removePost}
      />
    </>
  );
}
