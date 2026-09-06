import { z } from "zod";

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "O usuário precisa de ao menos 3 caracteres.")
  .max(20, "O usuário pode ter no máximo 20 caracteres.")
  .regex(/^[a-z0-9_]+$/, "Use apenas letras minúsculas, números e underline.");

export const registerSchema = z.object({
  username: usernameSchema,
  name: z.string().trim().min(2, "Informe seu nome.").max(60),
  password: z.string().min(6, "A senha precisa de ao menos 6 caracteres.").max(72),
  bio: z.string().trim().max(160).optional(),
});

export const loginSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1, "Informe a senha."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
