import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URL);
            console.log("MongoDB Connected");
        } else {
            console.log("MongoDB already connected");
        }
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
};
export default connectDB;
