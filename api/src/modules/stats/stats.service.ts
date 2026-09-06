import { prisma } from "../../lib/prisma.js";
import { publicUserSelect, type PublicUser } from "../../lib/serializers.js";

export type InteractionStat = {
  user: PublicUser;
  count: number;
};

async function buildRanking(tally: Map<string, number>, viewerId: string, limit: number): Promise<InteractionStat[]> {
  const ranked = [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
  const missing = limit - ranked.length;

  const fillers =
    missing > 0
      ? await prisma.user.findMany({
          where: { id: { notIn: [viewerId, ...ranked.map(([id]) => id)] } },
          select: publicUserSelect,
          orderBy: { createdAt: "asc" },
          take: missing,
        })
      : [];

  const users = await prisma.user.findMany({
    where: { id: { in: ranked.map(([id]) => id) } },
    select: publicUserSelect,
  });

  const byId = new Map(users.map((user) => [user.id, user]));

  const stats = ranked.flatMap(([id, count]) => {
    const user = byId.get(id);
    return user ? [{ user, count }] : [];
  });

  stats.sort((a, b) => b.count - a.count || a.user.name.localeCompare(b.user.name, "pt-BR"));

  return [...stats, ...fillers.map((user) => ({ user, count: 0 }))];
}

export async function whoICommentMost(viewerId: string, limit: number): Promise<InteractionStat[]> {
  const comments = await prisma.comment.findMany({
    where: { authorId: viewerId, post: { authorId: { not: viewerId } } },
    select: { post: { select: { authorId: true } } },
  });

  const tally = new Map<string, number>();
  for (const comment of comments) {
    const authorId = comment.post.authorId;
    tally.set(authorId, (tally.get(authorId) ?? 0) + 1);
  }

  return buildRanking(tally, viewerId, limit);
}

export async function whoCommentsMe(viewerId: string, limit: number): Promise<InteractionStat[]> {
  const rows = await prisma.comment.groupBy({
    by: ["authorId"],
    where: { post: { authorId: viewerId }, authorId: { not: viewerId } },
    _count: { _all: true },
  });

  const tally = new Map(rows.map((row) => [row.authorId, row._count._all]));

  return buildRanking(tally, viewerId, limit);
}
