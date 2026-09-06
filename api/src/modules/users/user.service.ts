import { prisma } from "../../lib/prisma.js";
import { notFound } from "../../lib/errors.js";
import { publicUserSelect, type PublicUser } from "../../lib/serializers.js";

export type Profile = PublicUser & {
  counts: { posts: number; comments: number };
};

export async function getByUsername(username: string): Promise<Profile> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { ...publicUserSelect, _count: { select: { posts: true, comments: true } } },
  });

  if (!user) {
    throw notFound("Perfil não encontrado.");
  }

  const { _count, ...profile } = user;
  return { ...profile, counts: { posts: _count.posts, comments: _count.comments } };
}
