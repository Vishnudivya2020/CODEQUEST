import mongoose from "mongoose";

const LoginHistorySchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    email: String,
    ipAddress: String,
    browser: String,
    os: String,
    deviceType: String,
    loginTime: { type: Date, default: Date.now },
    otpRequired: { type: Boolean, default: false },     
    otpVerified: { type: Boolean, default: false },     
    location: {                                         
        country: String,
        region: String,
        city: String
    }
});

export default mongoose.model("LoginHistory", LoginHistorySchema);
