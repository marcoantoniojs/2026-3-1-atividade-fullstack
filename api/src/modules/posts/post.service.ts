import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { forbidden, notFound } from "../../lib/errors.js";
import { publicUserSelect, type PublicUser } from "../../lib/serializers.js";
import { cursorArgs, splitPage } from "../../lib/pagination.js";
import type { CreatePostInput, ListPostsInput } from "./post.schemas.js";

export type CommentPreview = {
  id: string;
  content: string;
  createdAt: Date;
  author: PublicUser;
};

export type PostPayload = {
  id: string;
  content: string;
  createdAt: Date;
  author: PublicUser;
  commentCount: number;
  firstComment: CommentPreview | null;
  rating: { average: number; count: number; myValue: number | null };
};

const postSelect = {
  id: true,
  content: true,
  createdAt: true,
  author: { select: publicUserSelect },
} satisfies Prisma.PostSelect;

type RawPost = Prisma.PostGetPayload<{ select: typeof postSelect }>;

async function decorate(posts: RawPost[], viewerId?: string): Promise<PostPayload[]> {
  if (posts.length === 0) {
    return [];
  }

  const postId = { in: posts.map((post) => post.id) };

  const [comments, previews, ratings, mine] = await Promise.all([
    prisma.comment.groupBy({ by: ["postId"], where: { postId }, _count: { _all: true } }),
    prisma.comment.findMany({
      where: { postId, parentId: null },
      select: {
        id: true,
        content: true,
        createdAt: true,
        postId: true,
        author: { select: publicUserSelect },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.rating.groupBy({ by: ["postId"], where: { postId }, _avg: { value: true }, _count: { _all: true } }),
    viewerId
      ? prisma.rating.findMany({ where: { postId, userId: viewerId }, select: { postId: true, value: true } })
      : Promise.resolve([]),
  ]);

  const commentCount = new Map(comments.map((row) => [row.postId, row._count._all]));

  const firstComment = new Map<string, CommentPreview>();
  for (const { postId: id, ...preview } of previews) {
    if (!firstComment.has(id)) {
      firstComment.set(id, preview);
    }
  }

  const ratingSummary = new Map(ratings.map((row) => [row.postId, row]));
  const myRating = new Map(mine.map((row) => [row.postId, row.value]));

  return posts.map((post) => {
    const summary = ratingSummary.get(post.id);
    return {
      ...post,
      commentCount: commentCount.get(post.id) ?? 0,
      firstComment: firstComment.get(post.id) ?? null,
      rating: {
        average: summary?._avg.value ? Number(summary._avg.value.toFixed(2)) : 0,
        count: summary?._count._all ?? 0,
        myValue: myRating.get(post.id) ?? null,
      },
    };
  });
}

function searchFilter(q?: string): Prisma.PostWhereInput {
  if (!q) {
    return {};
  }

  return {
    OR: [
      { content: { contains: q, mode: "insensitive" } },
      { author: { name: { contains: q, mode: "insensitive" } } },
      { author: { username: { contains: q, mode: "insensitive" } } },
    ],
  };
}

async function paginate(where: Prisma.PostWhereInput, input: ListPostsInput, viewerId?: string) {
  const rows = await prisma.post.findMany({
    where,
    select: postSelect,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    ...cursorArgs(input),
  });

  const { items, nextCursor } = splitPage(rows, input.limit);
  return { items: await decorate(items, viewerId), nextCursor };
}

export function listFeed(input: ListPostsInput, viewerId?: string) {
  return paginate(searchFilter(input.q), input, viewerId);
}

export function listByAuthor(authorId: string, input: ListPostsInput, viewerId?: string) {
  return paginate({ authorId, ...searchFilter(input.q) }, input, viewerId);
}

export async function getById(id: string, viewerId?: string): Promise<PostPayload> {
  const post = await prisma.post.findUnique({ where: { id }, select: postSelect });

  if (!post) {
    throw notFound("Publicação não encontrada.");
  }

  const [payload] = await decorate([post], viewerId);
  return payload;
}

export async function create(authorId: string, input: CreatePostInput): Promise<PostPayload> {
  const post = await prisma.post.create({
    data: { content: input.content, authorId },
    select: postSelect,
  });

  const [payload] = await decorate([post], authorId);
  return payload;
}

export async function remove(id: string, userId: string) {
  const post = await prisma.post.findUnique({ where: { id }, select: { authorId: true } });

  if (!post) {
    throw notFound("Publicação não encontrada.");
  }

  if (post.authorId !== userId) {
    throw forbidden("Você só pode apagar as suas publicações.");
  }

  await prisma.post.delete({ where: { id } });
}
