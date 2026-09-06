import express from "express";
import cors from "cors";
import { env } from "./env.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.WEB_ORIGIN }));
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "diatinf-x-api" });
  });

  return app;
}
