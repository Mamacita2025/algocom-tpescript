// Exemplo simplificado de handler com tratamento de erros
import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const { username, email, password } = req.body;

  // validações básicas
  if (!username || !password) {
    return res.status(400).json({ error: "username e password são obrigatórios." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Senha deve ter ao menos 6 caracteres." });
  }

  try {
    // checar usuário duplicado
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ error: "Username já cadastrado." });
    }

    // salvar no banco
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hash });
    await newUser.save();

    return res.status(201).json({ message: "Usuário criado com sucesso." });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Erro em /api/auth/register:", err);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}
