import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Não autorizado." });
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret!) as { userId: string };

    const { username, avatar } = req.body;

    if (!username || typeof username !== "string") {
      return res.status(400).json({ error: "Nome inválido." });
    }

    const updated = await User.findByIdAndUpdate(
      decoded.userId,
      { username, avatar },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Usuário não encontrado." });

    res.status(200).json({ message: "Dados atualizados com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar dados." });
  }
}
