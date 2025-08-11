import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
   purpose: {
    type: String,
    enum: ["login", "videoUpload", "chatbot"], 
    required: true,
    
  },
   verified: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, 
  },
   used: { type: Boolean, default: false },
},{ timestamps: true });

export default  mongoose.model('Otp', otpSchema);

