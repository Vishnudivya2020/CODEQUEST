import express from "express";
import { postvideoanswer,deletevideoanswer } from "../controller/videoController/VideoAnswer.js";
const router = express.Router();

router.patch("/post/:id", postvideoanswer);

router.patch("/delete/:id", deletevideoanswer);

export default router;
