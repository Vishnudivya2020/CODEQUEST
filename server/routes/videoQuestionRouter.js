
import express from "express";
import multer from "multer";
import path from "path";
import {
  AskVideoquestion,
  getallVideoquestion,
  deleteVideoquestion,
  getVideoQuestionById,
voteVideoquestion } from '../controller/videoController/videoQuestion.js'
import auth from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos"); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["video/mp4", "video/mkv", "video/webm"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only MP4/MKV/WEBM videos are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, 
});

router.post("/upload", auth, upload.single("video"), AskVideoquestion);
router.get("/", getallVideoquestion);
router.get("/:id", getVideoQuestionById); 
router.delete("/delete/:id", auth, deleteVideoquestion);
router.patch("/vote/:id", auth, voteVideoquestion);

export default router;


