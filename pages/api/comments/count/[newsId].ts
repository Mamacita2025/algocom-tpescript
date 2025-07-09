import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  const { newsId } = req.query;

  if (!newsId || typeof newsId !== "string" || !mongoose.Types.ObjectId.isValid(newsId)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const count = await Comment.countDocuments({ newsId });
    res.status(200).json({ count });
  } catch {
    res.status(500).json({ error: "Erro ao contar comentários." });
  }
}
