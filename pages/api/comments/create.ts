import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });

  const { newsId, user, text } = req.body;
  if (!text || !newsId) return res.status(400).json({ error: "Dados incompletos." });

  try {
    const novo = await Comment.create({ newsId, user, text });
    res.status(201).json({ data: novo });
  } catch {
    res.status(500).json({ error: "Erro ao comentar." });
  }
}
