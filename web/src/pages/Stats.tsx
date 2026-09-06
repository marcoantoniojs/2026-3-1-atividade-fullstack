import { Link } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { Icon } from "../components/Icon";
import { useSocialStats } from "../hooks/useSocialStats";
import type { InteractionStat } from "../lib/types";
import rail from "../components/SocialStatsRail.module.css";
import styles from "./page.module.css";

function StatList({ title, stats }: { title: string; stats: InteractionStat[] }) {
  return (
    <section className={rail.section}>
      <h2 className={rail.title}>{title}</h2>
      {stats.map(({ user, count }) => (
        <Link key={user.id} className={rail.row} to={`/perfil/${user.username}`}>
          <Avatar user={user} size={32} />
          <span className={rail.name}>{user.name}</span>
          <span className={rail.count}>
            <Icon name="comment" size={16} />
            {count}
          </span>
        </Link>
      ))}
    </section>
  );
}

export function Stats() {
  const { iComment, commentsMe, loading } = useSocialStats(10);

  return (
    <>
      <h1 className={styles.title}>Social Stats</h1>

      {loading ? (
        <p className={styles.subtitle}>Carregando estatísticas...</p>
      ) : (
        <>
          <StatList title="Quem você mais comenta" stats={iComment} />
          <StatList title="Quem mais te comenta" stats={commentsMe} />
        </>
      )}
    </>
  );
}
