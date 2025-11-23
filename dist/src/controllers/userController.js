"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.loginUser = exports.createUser = void 0;
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "secret";
// Registrar usuario
const createUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Missing fields" });
    const hashed = await bcryptjs_1.default.hash(password, 10);
    try {
        const user = await db_1.prisma.user.create({
            data: { email, password: hashed },
        });
        res.status(201).json({ id: user.id, email: user.email });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};
exports.createUser = createUser;
// Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "Missing fields" });
    try {
        const user = await db_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match)
            return res.status(401).json({ error: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};
exports.loginUser = loginUser;
// Listar usuarios
const getUsers = async (req, res) => {
    try {
        const users = await db_1.prisma.user.findMany({ select: { id: true, email: true } });
        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};
exports.getUsers = getUsers;
