import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  sendVideoOtp,
  verifyVideoOtp,
  uploadVideo,
  getAllVideos
} from '../controller/videoController/Video.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + path.extname(file.originalname))
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["video/mp4", "video/webm", "video/mkv"];
    allowedTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Only MP4, MKV, WEBM formats allowed"));
  },
});
router.post("/send-otp", sendVideoOtp);
router.post("/verify-otp", verifyVideoOtp);
router.post("/upload", upload.single("video"), uploadVideo);
router.get("/videos", getAllVideos);

export default router;
