
import Otp from "../models/Otp.js"; 
import nodemailer from "nodemailer";
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { fileURLToPath } from "url";
import videoSchema from '../models/videoModel.js';

const verifiedUsers = new Set();


//  Send Video OTP
export const sendVideoOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to DB (old ones auto-expire)
    await Otp.create({ email, otp,purpose:"videoUpload" });

    // Send OTP via Email (you can use your own mail config)
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME, 
      pass: process.env.EMAIL_PASSWORD,
    }
  });

    const mailOptions = {
      from:process.env.EMAIL_USERNAME ,
      to: email,
      subject: "Your Video OTP",
      text: `Your OTP for video verification is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    // console.log(`OTP sent to ${email}: ${otp}`);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ✅ Verify Video OTP
export const verifyVideoOtp = async (req, res) => {
  try {
    const { email, otp ,purpose} = req.body;

    // console.log("REQ BODY on OTP Verify:", req.body);

    // Find OTP for this email
    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });

    // console.log("Stored OTP:", otpRecord);

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    // console.log(`Comparing -> ${otp} vs ${otpRecord.otp}`);

    if (otp !== otpRecord.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
     verifiedUsers.add(email); // ✅ Save this email as verified
    res.status(200).json({success:true, massage: "OTP verified successfully" });
  
 } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({success:false, message: "Failed to verify OTP" });
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ffmpeg.setFfmpegPath('C:\\path\\to\\ffmpeg.exe');
ffmpeg.setFfmpegPath(ffmpegPath);


export const uploadVideo = async (req, res) => {
  const { email ,questionTitle} = req.body;
 //step 1:OTP check
  if (!verifiedUsers.has(email)) {
    return res.status(403).json({ message: "OTP verification required before uploading video" });
  }

  //step 2:file check
  if (!req.file) {
    return res.status(400).json({ message: 'No video file uploaded' });
  }

  const filePath = req.file.path;
  const fileSizeInMB = req.file.size / (1024 * 1024); // Convert bytes to MB
   const filename =req.file.filename;

  // step 3:Check Time Range(2 PM - 7 PM)
  const now = new Date();
  const hour = now.getHours();

  if (hour < 11 || hour >= 19) {
    fs.unlinkSync(filePath); // delete uploaded file if out of allowed time
    return res.status(403).json({ message: 'Video uploads are allowed only between 2 PM and 7 PM' });
  }

  // step 4: Check file size(Max 50MB)
  if (fileSizeInMB > 50) {
    fs.unlinkSync(filePath); // delete uploaded file
    return res.status(400).json({ message: 'Video file size exceeds 50MB limit' });
  }

  // step 5:Check video duration
  ffmpeg.ffprobe(filePath, async (err, metadata) => {
    if (err || !metadata || !metadata.format || !metadata.format.duration) {
      console.error("FFprobe Error:",err ||"Invalid metadata");
      fs.unlinkSync(filePath);
      return res.status(500).json({ message: 'Error processing video metadata' });
    }

    const duration = metadata.format.duration;
    if (duration > 120) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Video duration exceeds 2 minutes limit' });
    }

     // ✅ Passed all checks → Save metadata to MongoDB
    try {
      const videoDoc = new videoSchema({
        email,
        filePath: `/uploads/${filename}`, //  used on frontend to fetch video
        originalName: req.file.originalname,
        questionTitle,
        uploadedAt: new Date()
      });

      await videoDoc.save();

    verifiedUsers.delete(email);

    res.status(200).json({
       message: "Video uploaded successfully", 
      //  filename: req.file.filename 
       video: {
          id: videoDoc._id,
          questionTitle: videoDoc.questionTitle,
          videoUrl: videoDoc.filePath,
          uploadedAt: videoDoc.uploadedAt
        }
      });
    }catch (saveError){
      console.error("MongoDB Save Error:", saveError);
      fs.unlinkSync(filePath); // delete file if DB save fails
      res.status(500).json({ message: 'Failed to save video metadata to DB' });
    }
 
    

  });
};

export const getAllVideos = async (req, res) => {
  try {
    const videos = await videoSchema.find().sort({ uploadedAt: -1 });
    res.status(200).json(videos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch videos" });
  }
};
