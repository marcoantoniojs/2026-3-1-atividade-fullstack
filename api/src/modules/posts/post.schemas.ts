import { z } from "zod";
import { paginationSchema } from "../../lib/pagination.js";

export const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Escreva algo antes de publicar.")
    .max(280, "A publicação pode ter no máximo 280 caracteres."),
});

export const listPostsSchema = paginationSchema.extend({
  q: z.string().trim().max(120).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type ListPostsInput = z.infer<typeof listPostsSchema>;
