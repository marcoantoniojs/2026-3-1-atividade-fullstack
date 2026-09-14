import express from "express";
import cors from "cors";
import { env } from "./env.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { postRouter } from "./modules/posts/post.routes.js";
import { commentRouter } from "./modules/comments/comment.routes.js";
import { userRouter } from "./modules/users/user.routes.js";
import { statsRouter } from "./modules/stats/stats.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.WEB_ORIGIN, credentials: true }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "diatinf-x-api" });
  });

  app.use("/auth", authRouter);
  app.use("/posts", postRouter);
  app.use("/comments", commentRouter);
  app.use("/users", userRouter);
  app.use("/stats", statsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
