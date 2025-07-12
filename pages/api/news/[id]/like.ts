// pages/api/news/[id]/like.ts
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose, { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";

type TokenPayload = { userId: string };
type LikeResponse = { message: string; likes: number; likedBy: string[] };
type ErrorResponse = { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LikeResponse | ErrorResponse>
) {
  await connectDB();

  // 1) Valida o ID
  const { id } = req.query;
  if (!id || Array.isArray(id) || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID da notícia inválido." });
  }
  const newsId = id as string;

  // 2) Só POST e DELETE
  if (!["POST", "DELETE"].includes(req.method!)) {
    return res.status(405).json({ error: "Método não permitido." });
  }

  // 3) Extrai token
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token ausente ou mal formatado." });
  }
  const token = auth.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res
      .status(500)
      .json({ error: "JWT_SECRET não configurado no ambiente." });
  }

  // 4) Verifica JWT e faz type-guard
  let decoded: unknown;
  try {
    decoded = jwt.verify(token, secret);
  } catch {
    return res.status(401).json({ error: "Token inválido." });
  }

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    !("userId" in decoded) ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (decoded as any).userId !== "string"
  ) {
    return res.status(401).json({ error: "Token inválido." });
  }
  const userId = (decoded as TokenPayload).userId;

  // 5) Converte userId para ObjectId
  const userObjectId = new Types.ObjectId(userId);

  // 6) Busca o documento já tipado como INews
  const newsDoc = await News.findById(newsId);
  if (!newsDoc) {
    return res.status(404).json({ error: "Notícia não encontrada." });
  }

  // 7) Verifica se já curtiu usando ObjectId.equals()
  const alreadyLiked = newsDoc.likedBy.some((oid) => oid.equals(userObjectId));

  if (req.method === "POST") {
    if (!alreadyLiked) {
      newsDoc.likedBy.push(userObjectId);
      newsDoc.likes += 1;
    }
  } else {
    if (alreadyLiked) {
      newsDoc.likedBy = newsDoc.likedBy.filter(
        (oid) => !oid.equals(userObjectId)
      );
      newsDoc.likes = Math.max(0, newsDoc.likes - 1);
    }
  }

  // 8) Persiste mudança
  await newsDoc.save();

  // 9) Prepara likedBy como string[] para a resposta
  const likedByStrings = newsDoc.likedBy.map((oid) => oid.toHexString());

  return res.status(200).json({
    message:
      req.method === "POST"
        ? "Curtida registrada."
        : "Curtida removida.",
    likes: newsDoc.likes,
    likedBy: likedByStrings,
  });
}
