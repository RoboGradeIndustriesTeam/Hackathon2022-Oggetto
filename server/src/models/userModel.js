import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  login: { type: String, unique: true },
  encryptedPassword: { type: String },
  role: { type: String },
  city: { type: String },
  display_name: { type: String },
  avatar: { type: String },
  email: { type: String },
});

const user = mongoose.model("user", userSchema);

export default user;
