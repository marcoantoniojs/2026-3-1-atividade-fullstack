import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../env.js";
import { signToken } from "../../lib/jwt.js";
import { HttpError, badRequest, unauthorized } from "../../lib/errors.js";
import { toPublicUser, type PublicUser } from "../../lib/serializers.js";

type SuapProfile = {
  identificacao: string;
  nome: string;
  email?: string;
  foto?: string;
};

function ensureConfigured() {
  if (!env.SUAP_CLIENT_ID || !env.SUAP_CLIENT_SECRET) {
    throw new HttpError(503, "O login pelo SUAP não está configurado neste servidor.");
  }
}

export function getAuthorizationUrl() {
  ensureConfigured();

  const state = randomUUID();
  const url = new URL("/o/authorize/", env.SUAP_BASE_URL);

  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", env.SUAP_CLIENT_ID);
  url.searchParams.set("redirect_uri", env.SUAP_REDIRECT_URI);
  url.searchParams.set("scope", env.SUAP_SCOPE);
  url.searchParams.set("state", state);

  return { url: url.toString(), state };
}

async function exchangeCode(code: string): Promise<string> {
  const response = await fetch(new URL("/o/token/", env.SUAP_BASE_URL), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: env.SUAP_REDIRECT_URI,
      client_id: env.SUAP_CLIENT_ID,
      client_secret: env.SUAP_CLIENT_SECRET,
    }),
  });

  const payload = (await response.json().catch(() => null)) as { access_token?: string; error_description?: string } | null;

  if (!response.ok || !payload?.access_token) {
    throw badRequest(payload?.error_description ?? "Não foi possível validar o código do SUAP.");
  }

  return payload.access_token;
}

async function fetchProfile(accessToken: string): Promise<SuapProfile> {
  const response = await fetch(new URL("/api/eu/", env.SUAP_BASE_URL), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw unauthorized("Não foi possível ler seus dados no SUAP.");
  }

  const profile = (await response.json()) as SuapProfile;

  if (!profile?.identificacao) {
    throw unauthorized("O SUAP não retornou a sua identificação.");
  }

  return profile;
}

function sanitize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 20);
}

async function pickUsername(profile: SuapProfile) {
  const candidates = [
    profile.email ? sanitize(profile.email.split("@")[0]) : "",
    sanitize(profile.nome).split("_").slice(0, 2).join("_"),
    sanitize(profile.identificacao),
  ].filter((candidate) => candidate.length >= 3);

  for (const candidate of candidates) {
    const taken = await prisma.user.findUnique({ where: { username: candidate }, select: { id: true } });

    if (!taken) {
      return candidate;
    }
  }

  const base = (candidates[0] ?? "suap").slice(0, 14);

  for (let attempt = 1; attempt <= 50; attempt += 1) {
    const candidate = `${base}_${attempt}`;
    const taken = await prisma.user.findUnique({ where: { username: candidate }, select: { id: true } });

    if (!taken) {
      return candidate;
    }
  }

  return `suap_${Date.now().toString(36)}`.slice(0, 20);
}

export async function loginWithCode(code: string): Promise<{ token: string; user: PublicUser }> {
  ensureConfigured();

  const profile = await fetchProfile(await exchangeCode(code));
  const existing = await prisma.user.findUnique({ where: { suapId: profile.identificacao } });

  const user = existing
    ? await prisma.user.update({
        where: { id: existing.id },
        data: { name: profile.nome, avatarUrl: profile.foto ?? existing.avatarUrl },
      })
    : await prisma.user.create({
        data: {
          suapId: profile.identificacao,
          username: await pickUsername(profile),
          name: profile.nome,
          avatarUrl: profile.foto ?? null,
        },
      });

  return { token: signToken({ sub: user.id, username: user.username }), user: toPublicUser(user) };
}
