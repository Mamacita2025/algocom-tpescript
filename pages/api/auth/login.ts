// pages/api/auth/login.ts

import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";                // ou "bcryptjs" se usar essa lib no registro
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { Types } from "mongoose";

interface IUser {
  _id: Types.ObjectId;
  username: string;
  password: string;      // deve ser o mesmo campo do schema onde está o hash
  role: string;
  avatar?: string;
}

// Garante que JWT_SECRET exista
const SECRET = process.env.JWT_SECRET as string;
if (!SECRET) throw new Error("Missing JWT_SECRET in environment");

type LoginResponse = { token: string } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  // Log inicial para depuração
  console.log("→[/api/auth/login] chamada recebida");
  console.log("Método:", req.method);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  // Conecta ao MongoDB
  await connectDB();

  // Só aceita POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    console.log("⛔ Método não permitido");
    return res.status(405).json({ error: "Método não permitido. Use POST." });
  }

  try {
    // Extrai as credenciais do body
    const { username, password } = req.body as {
      username?: unknown;
      password?: unknown;
    };

    console.log("Credenciais recebidas:", { username, password });

    // Validação simples de tipos
    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      console.log("⛔ Username ou senha inválidos/no empty");
      return res
        .status(400)
        .json({ error: "Username e password são obrigatórios." });
    }

    // Busca o usuário no banco
    const user = (await User.findOne({ username }).lean()) as IUser | null;
    if (!user) {
      console.log("⛔ Usuário não encontrado:", username);
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Verifica se o campo de hash existe
    if (!user.password) {
      console.log("⛔ Hash de senha ausente para o usuário:", username);
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    console.log("Hash armazenado no BD:", user.password);

    // Compara a senha fornecida com o hash
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Resultado bcrypt.compare:", isMatch);

    if (!isMatch) {
      console.log("⛔ Senha incorreta para o usuário:", username);
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Prepara payload do JWT
    const payload = {
      userId:   user._id.toString(),
      username: user.username,
      role:     user.role,
    };

    // Gera o token
    const token = jwt.sign(payload, SECRET, { expiresIn: "1d" });
    console.log("✅ Login bem-sucedido para:", username);

    return res.status(200).json({ token });
  } catch (error) {
    console.error("❌ Erro em /api/auth/login:", error);
    return res
      .status(500)
      .json({ error: "Erro interno no servidor. Tente novamente." });
  }
}
