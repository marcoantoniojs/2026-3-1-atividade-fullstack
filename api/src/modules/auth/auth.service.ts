import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { signToken } from "../../lib/jwt.js";
import { conflict, notFound, unauthorized } from "../../lib/errors.js";
import { toPublicUser, type PublicUser } from "../../lib/serializers.js";
import type { LoginInput, RegisterInput } from "./auth.schemas.js";

type Session = { token: string; user: PublicUser };

function createSession(user: { id: string; username: string }) {
  return signToken({ sub: user.id, username: user.username });
}

export async function register(input: RegisterInput): Promise<Session> {
  const existing = await prisma.user.findUnique({ where: { username: input.username } });

  if (existing) {
    throw conflict("Este nome de usuário já está em uso.");
  }

  const user = await prisma.user.create({
    data: {
      username: input.username,
      name: input.name,
      bio: input.bio ?? null,
      passwordHash: await bcrypt.hash(input.password, 10),
    },
  });

  return { token: createSession(user), user: toPublicUser(user) };
}

export async function login(input: LoginInput): Promise<Session> {
  const user = await prisma.user.findUnique({ where: { username: input.username } });

  if (!user?.passwordHash) {
    throw unauthorized("Usuário ou senha incorretos.");
  }

  const matches = await bcrypt.compare(input.password, user.passwordHash);

  if (!matches) {
    throw unauthorized("Usuário ou senha incorretos.");
  }

  return { token: createSession(user), user: toPublicUser(user) };
}

export async function me(userId: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw notFound("Usuário não encontrado.");
  }

  return toPublicUser(user);
}
