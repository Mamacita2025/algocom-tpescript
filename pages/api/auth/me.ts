// pages/api/auth/me.ts

import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

type TokenPayload = { userId: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Só aceita GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  // Cabeçalho Authorization: "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Token não enviado." });
  }

  const token = authHeader.replace("Bearer ", "");
  let payload: TokenPayload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch {
    return res.status(401).json({ error: "Token inválido." });
  }

  await connectDB();
  const user = await User.findById(payload.userId)
    .select("username role avatar")
    .lean();

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }

  // Retorna dados do usuário
  return res.status(200).json({ user });
}
