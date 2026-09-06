import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { notFound } from "../../lib/errors.js";

export const rateSchema = z.object({
  value: z.coerce
    .number()
    .int()
    .min(1, "A avaliação vai de 1 a 3 estrelas.")
    .max(3, "A avaliação vai de 1 a 3 estrelas."),
});

export type RatingSummary = {
  average: number;
  count: number;
  myValue: number | null;
};

async function summarize(postId: string, userId: string): Promise<RatingSummary> {
  const [aggregate, mine] = await Promise.all([
    prisma.rating.aggregate({ where: { postId }, _avg: { value: true }, _count: { _all: true } }),
    prisma.rating.findUnique({ where: { postId_userId: { postId, userId } }, select: { value: true } }),
  ]);

  return {
    average: aggregate._avg.value ? Number(aggregate._avg.value.toFixed(2)) : 0,
    count: aggregate._count._all,
    myValue: mine?.value ?? null,
  };
}

export async function rate(postId: string, userId: string, value: number): Promise<RatingSummary> {
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });

  if (!post) {
    throw notFound("Publicação não encontrada.");
  }

  await prisma.rating.upsert({
    where: { postId_userId: { postId, userId } },
    create: { postId, userId, value },
    update: { value },
  });

  return summarize(postId, userId);
}

export async function unrate(postId: string, userId: string): Promise<RatingSummary> {
  await prisma.rating.deleteMany({ where: { postId, userId } });
  return summarize(postId, userId);
}
