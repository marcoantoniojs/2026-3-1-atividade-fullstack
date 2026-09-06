import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSocialStats } from "../hooks/useSocialStats";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";
import type { InteractionStat } from "../lib/types";
import styles from "./SocialStatsRail.module.css";

function StatList({ title, stats }: { title: string; stats: InteractionStat[] }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      {stats.map(({ user, count }) => (
        <Link key={user.id} className={styles.row} to={`/perfil/${user.username}`}>
          <Avatar user={user} size={28} />
          <span className={styles.name}>{user.name}</span>
          <span className={styles.count}>
            <Icon name="comment" size={16} />
            {count}
          </span>
        </Link>
      ))}
    </section>
  );
}

export function SocialStatsRail() {
  const { user } = useAuth();
  const { iComment, commentsMe, loading } = useSocialStats(6);

  if (!user) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Social Stats</h2>
        <p className={styles.empty}>
          <Link to="/login">Entre na sua conta</Link> para ver com quem você mais conversa.
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Social Stats</h2>
        <p className={styles.empty}>Carregando...</p>
      </section>
    );
  }

  return (
    <>
      <StatList title="Quem você mais comenta" stats={iComment} />
      <StatList title="Quem mais te comenta" stats={commentsMe} />
    </>
  );
}
