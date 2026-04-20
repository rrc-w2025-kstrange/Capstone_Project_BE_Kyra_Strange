import express from "express";
import { signIn } from "../controllers/authController";

const router = express.Router();

router.post("/signIn", signIn);

export default router;
