// pages/api/auth/login.ts

import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error("Missing JWT_SECRET in environment");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ error: "Método não permitido. Use POST." });
  }

  try {
    const { username, password } = req.body;

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      return res
        .status(400)
        .json({ error: "Username e password são obrigatórios." });
    }

    // Busca o usuário no banco
    const user = await User.findOne({ username }).lean();
    if (!user || !user.password) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Compara senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Gera payload e token
    const payload = {
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
    };
    const token = jwt.sign(payload, SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({ token });
  } catch (err) {
    console.error("Erro em /api/auth/login:", err);
    return res
      .status(500)
      .json({ error: "Erro interno no servidor. Tente novamente." });
  }
}
