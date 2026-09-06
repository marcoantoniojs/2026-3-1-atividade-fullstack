import { initials } from "../lib/format";
import type { User } from "../lib/types";
import styles from "./Avatar.module.css";

type AvatarProps = {
  user: Pick<User, "name" | "avatarUrl">;
  size?: number;
};

export function Avatar({ user, size = 40 }: AvatarProps) {
  return (
    <span
      className={styles.avatar}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.36)) }}
      title={user.name}
    >
      {user.avatarUrl ? (
        <img className={styles.image} src={user.avatarUrl} alt="" loading="lazy" />
      ) : (
        initials(user.name)
      )}
    </span>
  );
}
