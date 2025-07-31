import Otp from "../models/Otp.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import axios from "axios";



dotenv.config();


// Utility to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Email transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOtp = async (req, res) => {
  const { email ,question } = req.body;

  // Block Java Questions
  const javaRegex =/\bjava\b/i;
  if(javaRegex.test(question)){
    return res.status(403).json({message:'I will not answer Java Questions.'});
  }

  const otp = generateOTP();
  await Otp.deleteMany({ email }); // Clear previous OTPs
  await Otp.create({ email, otp ,purpose:"chatbot"});

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: 'Your OTP for Chatbot Access',
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return res.status(500).json({ message: 'Error sending OTP', error: err });
    return res.status(200).json({ message: 'OTP sent successfully' });
  });
};

//OTP Verification.
export const verifyOtpAndAnswer = async (req, res) => {
  const { email, otp, question ,purpose} = req.body;

  const foundOtp = await Otp.findOne({ email, otp });
  if (!foundOtp) return res.status(400).json({ message: 'Invalid or expired OTP' });


  
    try {
    // Make request to OpenRouter API
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct", // Free model
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
           {
            role: "user",
            content: question,
          },
        ],
      },
       {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const answer = response.data.choices[0].message.content;
    return res.status(200).json({ message: answer });
  } catch (error) {
    console.error("OpenRouter error:", error.message);
    return res.status(500).json({ message: "Failed to generate answer", error });
  }
};

      

  

