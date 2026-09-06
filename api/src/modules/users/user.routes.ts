import { Router } from "express";
import { optionalAuth } from "../../middlewares/require-auth.js";
import { listPostsSchema } from "../posts/post.schemas.js";
import * as userService from "./user.service.js";
import * as postService from "../posts/post.service.js";

export const userRouter = Router();

userRouter.get<{ username: string }>("/:username", async (req, res) => {
  res.json(await userService.getByUsername(req.params.username.toLowerCase()));
});

userRouter.get<{ username: string }>("/:username/posts", optionalAuth, async (req, res) => {
  const profile = await userService.getByUsername(req.params.username.toLowerCase());
  const input = listPostsSchema.parse(req.query);
  res.json(await postService.listByAuthor(profile.id, input, req.user?.id));
});
