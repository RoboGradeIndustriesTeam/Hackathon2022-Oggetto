import jwt from "jsonwebtoken";
import user from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    let auth_header = req.headers.authorization;

    if (!auth_header) return res.status(400).json({ error: 1 });

    let token = auth_header.split(" ")[1];

    if (!token) return res.status(400).json({ error: 1 });

    let payload = jwt.verify(token, process.env.SECRET || "SECRET");

    if (!payload.user_id) return res.status(401).json({ error: 1 });

    let candidate = await user.findOne({ _id: payload.user_id });

    if (!candidate) return res.status(401).json({ error: 1 });

    req.user = candidate;

    next();
  } catch (e) {
    return res.status(401).json({ error: 1 });
  }
};

export default authMiddleware;
