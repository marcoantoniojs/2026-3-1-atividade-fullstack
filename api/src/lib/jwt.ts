import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../env.js";
import { unauthorized } from "./errors.js";

export type TokenPayload = {
  sub: string;
  username: string;
};

export function signToken(payload: TokenPayload) {
  const options: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded === "string" || !decoded.sub) {
      throw unauthorized("Sessão inválida.");
    }
    return { sub: String(decoded.sub), username: String(decoded.username ?? "") };
  } catch {
    throw unauthorized("Sessão expirada ou inválida.");
  }
}
