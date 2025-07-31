import express from "express"
import { Askquestion,getallquestion,deletequestion,votequestion } from "../controller/Question.js";
import videoUpload from "../middleware/videoupload.js";

import auth from "../middleware/auth.js"

const router=express.Router();

router.post('/Ask',auth,videoUpload.single("video"),    Askquestion);
router.get('/get',getallquestion);
router.delete("/delete/:id",auth,deletequestion);
router.patch("/vote/:id",auth,votequestion)


export default router;