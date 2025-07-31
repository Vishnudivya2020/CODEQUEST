// routes/videoRouter.js (unified)

import express from 'express';
import multer from 'multer';
import path from 'path';
import { sendVideoOtp, verifyVideoOtp, uploadVideo, getAllVideos } from "../controller/Video.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Optional health check
router.get('/ping', (req, res) => {
  res.send("Video router is working");
});

// OTP-related routes
router.post("/send-otp", sendVideoOtp);
router.post("/verify-otp", verifyVideoOtp);

// Video upload & fetch
router.post("/upload", upload.single("video"), uploadVideo);
router.get("/videos", getAllVideos);

export default router;
