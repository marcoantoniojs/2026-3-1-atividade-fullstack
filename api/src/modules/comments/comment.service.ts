import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { badRequest, forbidden, notFound } from "../../lib/errors.js";
import { publicUserSelect, type PublicUser } from "../../lib/serializers.js";
import type { CreateCommentInput } from "./comment.schemas.js";

export type CommentNode = {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  author: PublicUser;
  replies: CommentNode[];
};

const commentSelect = {
  id: true,
  content: true,
  createdAt: true,
  parentId: true,
  author: { select: publicUserSelect },
} satisfies Prisma.CommentSelect;

type RawComment = Prisma.CommentGetPayload<{ select: typeof commentSelect }>;

function buildTree(comments: RawComment[]): CommentNode[] {
  const nodes = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  for (const comment of comments) {
    nodes.set(comment.id, { ...comment, replies: [] });
  }

  for (const comment of comments) {
    const node = nodes.get(comment.id)!;
    const parent = comment.parentId ? nodes.get(comment.parentId) : undefined;

    if (parent) {
      parent.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export async function listByPost(postId: string): Promise<CommentNode[]> {
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });

  if (!post) {
    throw notFound("Publicação não encontrada.");
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    select: commentSelect,
    orderBy: { createdAt: "asc" },
  });

  return buildTree(comments);
}

export async function create(postId: string, authorId: string, input: CreateCommentInput): Promise<CommentNode> {
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { id: true } });

  if (!post) {
    throw notFound("Publicação não encontrada.");
  }

  if (input.parentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: input.parentId },
      select: { postId: true },
    });

    if (!parent) {
      throw notFound("Comentário respondido não encontrado.");
    }

    if (parent.postId !== postId) {
      throw badRequest("O comentário respondido pertence a outra publicação.");
    }
  }

  const comment = await prisma.comment.create({
    data: {
      postId,
      authorId,
      content: input.content,
      parentId: input.parentId ?? null,
    },
    select: commentSelect,
  });

  return { ...comment, replies: [] };
}

export async function reply(parentId: string, authorId: string, content: string): Promise<CommentNode> {
  const parent = await prisma.comment.findUnique({
    where: { id: parentId },
    select: { postId: true },
  });

  if (!parent) {
    throw notFound("Comentário não encontrado.");
  }

  return create(parent.postId, authorId, { content, parentId });
}

export async function remove(id: string, userId: string) {
  const comment = await prisma.comment.findUnique({ where: { id }, select: { authorId: true } });

  if (!comment) {
    throw notFound("Comentário não encontrado.");
  }

  if (comment.authorId !== userId) {
    throw forbidden("Você só pode apagar os seus comentários.");
  }

  await prisma.comment.delete({ where: { id } });
}
