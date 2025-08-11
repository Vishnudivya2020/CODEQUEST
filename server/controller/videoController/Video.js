
import Otp from "../../models/Otp.js";
import nodemailer from "nodemailer";
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { fileURLToPath } from "url";
import videoQuestion from "../../models/videoQuestion.js";

//  Send Video OTP
export const sendVideoOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({ email, otp, purpose: "videoUpload" });
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Your Video OTP",
      text: `Your OTP for video verification is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

//  Verify Video OTP
export const verifyVideoOtp = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;

    // console.log("REQ BODY on OTP Verify:", req.body);

    const otpRecord = await Otp.findOne({ email,purpose:"videoUpload" }).sort({ createdAt: -1 });

    //  console.log("Stored OTP:", otpRecord);

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    if (otp !== otpRecord.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    otpRecord.verified = true;
    await otpRecord.save();

    res.status(200).json({ success: true, massage: "OTP verified successfully" });

    await Otp.updateOne({ email, otp, purpose: 'videoUpload' }, { $set: { verified: true } });


  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ffmpeg.setFfmpegPath('C:\\path\\to\\ffmpeg.exe');
ffmpeg.setFfmpegPath(ffmpegPath);


export const uploadVideo = async (req, res) => {
  const { userposted: email,
     Videoquestiontitle="Untitled",
    Videoquestionbody = "Uploaded via video" ,Videoquestiontags,process="videoUpload"} = req.body;

 const otpRecord = await Otp.findOne({ email, purpose:"videoUpload",verified:true,used:false }).sort({ createdAt: -1 });
  // console.log("OTP Record for Upload:", otpRecord);
  if (!otpRecord ) {
    return res.status(403).json({ message: "OTP verification required before uploading video" });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No video file uploaded' });
  }

  const filePath = req.file.path;
  const fileSizeInMB = req.file.size / (1024 * 1024);
  const filename = req.file.filename;

  const now = new Date();
  const hour = now.getHours();

  if (hour < 10 || hour >= 19) {
    fs.unlinkSync(filePath); 
    return res.status(403).json({ message: 'Video uploads are allowed only between 2 PM and 7 PM' });
  }

  if (fileSizeInMB > 50) {
    fs.unlinkSync(filePath); 
    return res.status(400).json({ message: 'Video file size exceeds 50MB limit' });
  }

  ffmpeg.ffprobe(filePath, async (err, metadata) => {
    if (err || !metadata || !metadata.format || !metadata.format.duration) {
      console.error("FFprobe Error:", err || "Invalid metadata");
      fs.unlinkSync(filePath);
      return res.status(500).json({ message: 'Error processing video metadata' });
    }

    const duration = metadata.format.duration;
    if (duration > 120) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Video duration exceeds 2 minutes limit' });
    }

    try {
      const videoDoc = new videoQuestion({
        userposted: email,

        Videoquestiontitle,
        Videoquestionbody,
        Videoquestiontags,
        videopath: `/uploads/${filename}`,
        originalName: req.file.originalname,
        uploadedAt: new Date(),
      });
     


      await videoDoc.save();

      otpRecord.used = true;
      await otpRecord.save();


      res.status(200).json({
        message: "Video uploaded successfully",

        video: {
          id: videoDoc._id,
          questionTitle: videoDoc.questionTitle,
          videoUrl: videoDoc.filePath,
          uploadedAt: videoDoc.uploadedAt
        }
      });
    } catch (saveError) {
      console.error("MongoDB Save Error:", saveError);
      fs.unlinkSync(filePath);
      res.status(500).json({ message: 'Failed to save video metadata to DB' });
    }



  });
};

// export const getAllVideos = async (req, res) => {
//   try {
//     const videos = await videoQuestion.find().sort({ uploadedAt: -1 });
//     res.status(200).json(videos);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch videos" });
//   }



export const getAllVideos = async (req, res) => {
  try {
    const videos = await videoQuestion.find(
      {}, 
      { loginHistory: 0 } 
    ).lean();

    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Error fetching videos" });
  }
};

