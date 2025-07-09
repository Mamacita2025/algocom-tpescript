import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse ) {
  await connectDB();
  const { newsId } = req.query;

  try {
    const comentarios = await Comment.find({ newsId }).sort({ createdAt: -1 });
    res.status(200).json({ data: comentarios });
  } catch {
    res.status(500).json({ error: "Erro ao buscar comentários." });
  }
}
