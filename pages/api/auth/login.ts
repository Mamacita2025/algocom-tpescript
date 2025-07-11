// pages/api/auth/login.ts

import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { Types } from "mongoose";

interface IUser {
  _id: Types.ObjectId;
  username: string;
  password: string;
  role: string;
  avatar?: string;
}

// Garante que JWT_SECRET exista (lança se undefined)
const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) throw new Error("Missing JWT_SECRET in environment");
type LoginResponse = 
  | { token: string }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  // Conecta ao MongoDB
  await connectDB();

  // Só aceita POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res
      .status(405)
      .json({ error: "Método não permitido. Use POST." });
  }

  try {
    // Extrai e valida os campos do body
    const { username, password } = req.body as {
      username?: unknown;
      password?: unknown;
    };

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

    // Busca o usuário no banco como objeto "plain"
    const user = (await User.findOne({ username }).lean()) as
      | IUser
      | null;

    if (!user || !user.password) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Compara a senha com bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Gera o payload e o token JWT
    const payload = {
      userId: user._id.toString(),
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: "1d" });

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Erro em /api/auth/login:", error);
    return res
      .status(500)
      .json({ error: "Erro interno no servidor. Tente novamente." });
  }
}
