import type { User } from "@prisma/client";

export type PublicUser = {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: Date;
};

export const publicUserSelect = {
  id: true,
  username: true,
  name: true,
  avatarUrl: true,
  bio: true,
  createdAt: true,
} as const;

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    createdAt: user.createdAt,
  };
}
