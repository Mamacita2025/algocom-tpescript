import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const { username, email, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Usuário e senha são obrigatórios." });
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: "Nome de usuário já está em uso." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const novoUsuario = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user", // ✅ função padrão como usuário comum
    });

    // Evita retornar a senha hash
    const { password: _, ...userData } = novoUsuario.toObject();

    res.status(201).json({ message: "Usuário criado com sucesso", user: userData });
  } catch {
    res.status(500).json({ error: "Erro ao registrar o usuário." });
  }
}
