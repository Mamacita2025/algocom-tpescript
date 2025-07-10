// pages/api/user/activity.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import Comment from "@/models/Comment";
import News from "@/models/News";

type TokenPayload = { userId: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token ausente." });
  const token = authHeader.replace("Bearer ", "");
  let payload: TokenPayload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch {
    return res.status(401).json({ error: "Token inválido." });
  }

  const userId = payload.userId;

  try {
    // 1) Comentários do usuário, populando newsId
    const comments = await Comment.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({ path: "newsId", select: "title" }) // ❌ atenção ao field
      .lean();

    // 2) Notícias curtidas
    const likedNews = await News.find({ likedBy: userId })
      .select("title") // só precisa do título e _id
      .lean();

    return res.status(200).json({
      comments,   // cada item terá newsId: { _id, title } ou null
      likes: likedNews,
    });
  } catch (err) {
    console.error("Erro em /api/user/activity:", err);
    return res.status(500).json({ error: "Erro interno." });
  }
}
