import { z } from "zod";

export const usernameSchema = z
  .string({ error: "Informe o usuário." })
  .trim()
  .toLowerCase()
  .min(3, "O usuário precisa de ao menos 3 caracteres.")
  .max(20, "O usuário pode ter no máximo 20 caracteres.")
  .regex(/^[a-z0-9_]+$/, "Use apenas letras minúsculas, números e underline.");

export const registerSchema = z.object({
  username: usernameSchema,
  name: z.string({ error: "Informe seu nome." }).trim().min(2, "Informe seu nome.").max(60),
  password: z.string({ error: "Informe a senha." }).min(6, "A senha precisa de ao menos 6 caracteres.").max(72),
  bio: z.string().trim().max(160).optional(),
});

export const loginSchema = z.object({
  username: usernameSchema,
  password: z.string({ error: "Informe a senha." }).min(1, "Informe a senha."),
});

export const suapCallbackSchema = z.object({
  code: z.string({ error: "Informe o código devolvido pelo SUAP." }).trim().min(1, "Informe o código devolvido pelo SUAP."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
