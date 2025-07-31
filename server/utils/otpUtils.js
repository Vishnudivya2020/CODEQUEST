// controllers/otpController.js
import Otp from "../models/Otp.js";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";

// Send OTP
export const sendOTP = async ({email,purpose}) => {
  
  if (!email) throw new Error("Email is required to send OTP");

  const otp = otpGenerator.generate(6,{
    upperCaseAlphabets:false,
    lowerCaseAlphabets:false,
    specialChars:false,
    digits:true,
  });
  await Otp.findOneAndUpdate(
    { email },
    { otp,purpose, createdAt: new Date() },
    { upsert: true }
  );

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "Your Login OTP",
    text: `Your OTP is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
  return true;
};


// Verify OTP
export const verifyOTP = async ({ email, otp, purpose = "login" }) => {
  const record = await Otp.findOne({ email, purpose });

  if (!record) {
    throw new Error("No OTP found");
  }

  if (record.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  //  delete OTP after verification
  await Otp.deleteOne({ _id: record._id });

  return true; // OTP verified successfully
};

