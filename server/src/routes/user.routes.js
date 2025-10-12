import { registerUser } from "../controllers/user.controler.js";
import { Router } from "express";

const router = Router();

router.route("/register").post(registerUser);


export default router;