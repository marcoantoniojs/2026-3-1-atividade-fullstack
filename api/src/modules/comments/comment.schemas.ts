import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string({ error: "Escreva o comentário." })
    .trim()
    .min(1, "Escreva o comentário.")
    .max(280, "O comentário pode ter no máximo 280 caracteres."),
  parentId: z.string().optional(),
});

export const replySchema = createCommentSchema.omit({ parentId: true });

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
