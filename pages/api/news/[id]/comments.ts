import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import mongoose, { Types } from "mongoose";
import jwt from "jsonwebtoken";
import News from "@/models/News";
import Comment, { IComment } from "@/models/Comment";

interface TokenPayload {
  userId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  const { id } = req.query;

  if (!id || Array.isArray(id) || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID da notícia inválido." });
  }
  const newsObjId = new Types.ObjectId(id as string);

  // GET /api/news/:id/comments
  if (req.method === "GET") {
    try {
      const comments = await Comment.find({ newsId: newsObjId })
        .sort({ createdAt: -1 })
        .populate({ path: "user", select: "username avatar" })
        .lean();
      return res.status(200).json({ comments });
    } catch (err) {
      console.error("Erro ao buscar comentários:", err);
      return res.status(500).json({ error: "Erro ao buscar comentários." });
    }
  }

  // POST /api/news/:id/comments
  if (req.method === "POST") {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Token ausente." });
    }
    const token = authHeader.replace("Bearer ", "");
    let payload: TokenPayload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    } catch (e) {
      console.error("JWT inválido:", e);
      return res.status(401).json({ error: "Token inválido." });
    }

    const noticia = await News.findById(newsObjId);
    if (!noticia) {
      return res.status(404).json({ error: "Notícia não encontrada." });
    }

    const { text } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res
        .status(400)
        .json({ error: "O texto do comentário é obrigatório." });
    }

    try {
      const comment = await Comment.create({
        newsId: newsObjId,
        user: new Types.ObjectId(payload.userId),
        text: text.trim(),
      } as Partial<IComment>);

      // popula pelo campo 'user' (que existe no schema)
      await comment.populate({ path: "user", select: "username avatar" });

      return res.status(201).json({ comment });
    } catch (err) {
      console.error("Erro ao criar comentário:", err);
      return res
        .status(500)
        .json({ error: "Erro interno ao criar comentário." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res
    .status(405)
    .end(`Método ${req.method} não permitido.`);
}
