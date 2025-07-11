// lib/auth.ts

import type { NextApiRequest } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";

// Usa a variável de ambiente ou fallback (apenas em dev)
const SECRET = process.env.JWT_SECRET ?? "minha-chave-super-secreta";

// Shape do payload que assinamos no login
export interface IJwtUser extends JwtPayload {
  userId: string;
  username: string;
  role: string;
  avatar?: string;
}

/**
 * Extrai e valida o JWT no header Authorization do NextApiRequest.
 * @throws Error se token ausente ou inválido
 * @returns payload tipado como IJwtUser
 */
export function verifyToken(req: NextApiRequest): IJwtUser {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Token ausente.");
  }

  const token = authHeader.slice(7); // remove "Bearer "
  try {
    // jwt.verify pode retornar string ou JwtPayload
    const decoded = jwt.verify(token, SECRET) as IJwtUser;
    return decoded;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new Error("Token inválido.");
  }
}
