import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

const authorize = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If token missing
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No Token Provided" });
    }

    // Verify token using secret key "noor123"
    const decoded = jwt.verify(token, "your_secret_key");

    // Decode must contain userId
    if (!decoded || !decoded.userID) {
      return res.status(401).json({ message: "Unauthorized: Invalid Token" });
    }

    // Find user
    const user = await User.findById(decoded.userID).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User Not Found" });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      error: error.message,
    });
  }
};

export default authorize;
