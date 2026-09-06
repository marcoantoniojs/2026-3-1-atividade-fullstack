export type User = {
  id: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
};

export type Profile = User & {
  counts: { posts: number; comments: number };
};

export type Rating = {
  average: number;
  count: number;
  myValue: number | null;
};

export type CommentPreview = {
  id: string;
  content: string;
  createdAt: string;
  author: User;
};

export type Post = {
  id: string;
  content: string;
  createdAt: string;
  author: User;
  commentCount: number;
  firstComment: CommentPreview | null;
  rating: Rating;
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  author: User;
  replies: Comment[];
};

export type Page<T> = {
  items: T[];
  nextCursor: string | null;
};

export type InteractionStat = {
  user: User;
  count: number;
};

export type Session = {
  token: string;
  user: User;
};
