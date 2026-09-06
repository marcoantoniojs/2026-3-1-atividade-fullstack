import { Router } from "express";
import { requireAuth } from "../../middlewares/require-auth.js";
import { replySchema } from "./comment.schemas.js";
import * as commentService from "./comment.service.js";

export const commentRouter = Router();

commentRouter.post<{ id: string }>("/:id/replies", requireAuth, async (req, res) => {
  const { content } = replySchema.parse(req.body);
  res.status(201).json(await commentService.reply(req.params.id, req.user!.id, content));
});

commentRouter.delete<{ id: string }>("/:id", requireAuth, async (req, res) => {
  await commentService.remove(req.params.id, req.user!.id);
  res.status(204).end();
});
