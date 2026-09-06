import express from "express";
import cors from "cors";
import { env } from "./env.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.WEB_ORIGIN }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "diatinf-x-api" });
  });

  app.use("/auth", authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
