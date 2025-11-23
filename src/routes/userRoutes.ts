import { Router } from "express";
import { createUser, loginUser, getUsers } from "../controllers/userController";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/", getUsers);

export default router;
