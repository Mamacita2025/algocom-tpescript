// pages/api/user/activity.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Like from "@/models/Like";
import Comment from "@/models/Comment";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Não autorizado." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const likes = await Like.find({ userId: decoded.userId }).populate("newsId", "title");
    const comments = await Comment.find({ userId: decoded.userId }).populate("newsId", "title");

    res.status(200).json({ likes, comments });
  } catch {
    res.status(500).json({ error: "Erro ao carregar interações." });
  }
}
