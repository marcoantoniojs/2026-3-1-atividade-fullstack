import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt.js";
import { unauthorized } from "../lib/errors.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(unauthorized("Faça login para continuar."));
  }

  const payload = verifyToken(header.slice(7).trim());
  req.user = { id: payload.sub, username: payload.username };
  next();
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (header?.startsWith("Bearer ")) {
    try {
      const payload = verifyToken(header.slice(7).trim());
      req.user = { id: payload.sub, username: payload.username };
    } catch {
      req.user = undefined;
    }
  }

  next();
}
