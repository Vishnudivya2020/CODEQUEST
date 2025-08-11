// routes/authRoutes.js
import express from "express";
import  {signup ,login,getLoginHistory } from '../controller/auth.js';

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/login-history", auth, getLoginHistory);

export default router;
