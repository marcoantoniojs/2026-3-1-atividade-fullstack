import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middlewares/require-auth.js";
import * as statsService from "./stats.service.js";

const limitSchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(6),
});

export const statsRouter = Router();

statsRouter.use(requireAuth);

statsRouter.get("/i-comment-most", async (req, res) => {
  const { limit } = limitSchema.parse(req.query);
  res.json(await statsService.whoICommentMost(req.user!.id, limit));
});

statsRouter.get("/who-comments-me", async (req, res) => {
  const { limit } = limitSchema.parse(req.query);
  res.json(await statsService.whoCommentsMe(req.user!.id, limit));
});
