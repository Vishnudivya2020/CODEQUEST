import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  email: { type: String, required: true },
  filePath: { type: String, required: true },
  originalName: { type: String },
  questionTitle:{type:String},
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Video", videoSchema);
