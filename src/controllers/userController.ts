import { Request, Response } from "express";
import {prisma} from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logEvent } from "../utils/logger";


const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashed },
    });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logEvent(`Login fallido: usuario no encontrado - ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      logEvent(`Login fallido: contraseña incorrecta - ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    
    logEvent(`Login exitoso: ${email}`);

    res.json({ token });
  } catch (err: any) {
    console.error(err);
    logEvent(`Error de DB al hacer login: ${email} - ${err.message}`);
    res.status(500).json({ error: "DB error" });
  }
};


export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, email: true } });
    res.json(users);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
};
