import express from "express";
import { sendOTP, signup, login } from "../Controllers/Auth.Controller.js";

const router = express.Router();

router.post("/send-OTP", sendOTP);
router.post("/signup", signup);
router.post("/login", login);


export default router;