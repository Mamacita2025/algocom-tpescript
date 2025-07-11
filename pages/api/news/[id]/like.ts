/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/api/news/[id]/like.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

type TokenPayload = { userId: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const { id } = req.query;
  if (!id || Array.isArray(id) || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID da notícia inválido." });
  }

  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token ausente." });

  const token = authHeader.replace("Bearer ", "");
  let payload: TokenPayload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch (e) {
    return res.status(401).json({ error: "Token inválido." });
  }

  const update =
    req.method === "POST"
      ? { $addToSet: { likedBy: payload.userId }, $inc: { likes: 1 } }
      : { $pull: { likedBy: payload.userId }, $inc: { likes: -1 } };

  try {
    const news = await News.findByIdAndUpdate(id, update, { new: true });
    if (!news) return res.status(404).json({ error: "Notícia não encontrada." });

    return res.status(200).json({
      message: req.method === "POST" ? "Curtida registrada." : "Curtida removida.",
      likes: news.likes,
      likedBy: news.likedBy,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error("DB Error:", e);
    return res.status(500).json({ error: "Erro interno ao processar like." });
  }
}
