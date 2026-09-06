import { Router } from "express";
import { optionalAuth, requireAuth } from "../../middlewares/require-auth.js";
import { createPostSchema, listPostsSchema } from "./post.schemas.js";
import { createCommentSchema } from "../comments/comment.schemas.js";
import { rateSchema } from "../ratings/rating.service.js";
import * as postService from "./post.service.js";
import * as commentService from "../comments/comment.service.js";
import * as ratingService from "../ratings/rating.service.js";

export const postRouter = Router();

postRouter.get("/", optionalAuth, async (req, res) => {
  const input = listPostsSchema.parse(req.query);
  res.json(await postService.listFeed(input, req.user?.id));
});

postRouter.get("/me", requireAuth, async (req, res) => {
  const input = listPostsSchema.parse(req.query);
  res.json(await postService.listByAuthor(req.user!.id, input, req.user!.id));
});

postRouter.post("/", requireAuth, async (req, res) => {
  const input = createPostSchema.parse(req.body);
  res.status(201).json(await postService.create(req.user!.id, input));
});

postRouter.get<{ id: string }>("/:id", optionalAuth, async (req, res) => {
  res.json(await postService.getById(req.params.id, req.user?.id));
});

postRouter.delete<{ id: string }>("/:id", requireAuth, async (req, res) => {
  await postService.remove(req.params.id, req.user!.id);
  res.status(204).end();
});

postRouter.get<{ id: string }>("/:id/comments", async (req, res) => {
  res.json(await commentService.listByPost(req.params.id));
});

postRouter.post<{ id: string }>("/:id/comments", requireAuth, async (req, res) => {
  const input = createCommentSchema.parse(req.body);
  res.status(201).json(await commentService.create(req.params.id, req.user!.id, input));
});

postRouter.put<{ id: string }>("/:id/rating", requireAuth, async (req, res) => {
  const { value } = rateSchema.parse(req.body);
  res.json(await ratingService.rate(req.params.id, req.user!.id, value));
});

postRouter.delete<{ id: string }>("/:id/rating", requireAuth, async (req, res) => {
  res.json(await ratingService.unrate(req.params.id, req.user!.id));
});
