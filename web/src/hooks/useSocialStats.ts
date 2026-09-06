import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { request } from "../lib/api";
import type { InteractionStat } from "../lib/types";

export function useSocialStats(limit = 6) {
  const { user } = useAuth();
  const [iComment, setIComment] = useState<InteractionStat[]>([]);
  const [commentsMe, setCommentsMe] = useState<InteractionStat[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setIComment([]);
      setCommentsMe([]);
      return;
    }

    let active = true;
    setLoading(true);

    Promise.all([
      request<InteractionStat[]>("/stats/i-comment-most", { query: { limit } }),
      request<InteractionStat[]>("/stats/who-comments-me", { query: { limit } }),
    ])
      .then(([mine, theirs]) => {
        if (active) {
          setIComment(mine);
          setCommentsMe(theirs);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [user, limit]);

  return { iComment, commentsMe, loading };
}
