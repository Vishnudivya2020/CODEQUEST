import express from "express";
import {sendOtp ,verifyOtpAndAnswer} from "../controller/Chatbot.js";

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtpAndAnswer);

export default router;
