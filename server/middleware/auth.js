import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Auth token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    req.userId = decoded.id || decoded._id;
    next();
  } catch (error) {
    console.log("Auth error:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
export default auth;