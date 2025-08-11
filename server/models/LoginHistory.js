import mongoose from "mongoose";

const LoginHistorySchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User",required:true },
    email:{type:String,required:true} ,
    ipAddress:{type:String},
    browser: {type:String},
    os: {type:String},
    deviceType: {type:String},
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
