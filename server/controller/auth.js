import users from '../models/Auth.js'
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import LoginHistory from '../models/LoginHistory.js';
import { sendOTP, verifyOTP } from '../utils/otpUtils.js';
import { UAParser } from "ua-parser-js";
import requestIp from "request-ip";

const parser = new UAParser();



export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const extinguser = await users.findOne({ email });
        if (extinguser) {
            return res.status(404).json({ message: "User already exist" });
        }
        const hashedpassword = await bcrypt.hash(password, 12);
        const newuser = await users.create({
            name,
            email,
            password: hashedpassword
        });
        const token = jwt.sign({
            email: newuser.email, id: newuser._id
        }, process.env.JWT_SECRET, { expiresIn: "1h" }
        )
        res.status(201).json({ result: newuser, token });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "something went wrong..." });
        return
    }
};




// LOGIN CONTROLLER
export const login = async (req, res) => {
    const { email, password, otp } = req.body;

    const userAgent = req.headers["user-agent"];
    const parsedUA = parser.setUA(userAgent).getResult();
    const ip = requestIp.getClientIp(req);

    //  console.log("User-Agent Info:",parsedUA);
    const browser = parsedUA.browser?.name?.toLowerCase() || "UnKnown";
    const os = parsedUA.os?.name || "Unknown";
    const deviceType = parsedUA.device?.type || "Desktop";

    if (!email) {
  return res.status(400).json({ message: "Email is required" });
}


    const currentHour = new Date().getHours();

    try {
        const existingUser = await users.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // If mobile, restrict login to 10AM - 1PM
        if (deviceType === "mobile" && (currentHour < 10 || currentHour >= 13)) {
            return res.status(403).json({ message: "Mobile login allowed only between 10 AM and 1 PM" });
        }

        // If Chrome browser, trigger OTP
        const otpRequiredBrowsers = ["chrome"]
        // if (browser === "Chrome" || browser === "Edge") {
        if (otpRequiredBrowsers.includes(browser)) {
            if (!otp) {
                // Send OTP
                const sent = await sendOTP({email , purpose:"login"}); // implement sendOTP(email)
                if (sent) {
                    return res.status(401).json({ message: "OTP sent to email. Please verify OTP." });
                } else {
                    return res.status(500).json({ message: "Failed to send OTP" });
                }
            } else {
                // Verify OTP
                const isOtpValid = await verifyOTP({email, otp, purpose: "login"}); // implement verifyOTP(email, otp)
                if (!isOtpValid) {
                    return res.status(403).json({ message: "Invalid or expired OTP" });
                }
            }
        }


        // Save login history
        await LoginHistory.create({
            userId: existingUser._id,
            email: existingUser.email,
            ipAddress: ip,
            browser,
            os,
            deviceType,
            loginTime: new Date(),
        });
       
   // Sign JWT
        const token = jwt.sign(
            { email: existingUser.email, id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ result: existingUser, token });

    } catch (error) {
        console.log(error);
        res.status(500).json("Something went wrong...");
    }
};
