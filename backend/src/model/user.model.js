// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    studentId: {
      type: String,
      trim: true,
      sparse: true, // 🔥 important (optional unique fix)
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["student", "admin", "committee", "superadmin"],
      required: true,
    },

    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: function () {
        return this.role !== "superadmin";
      },
    },

    profileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// 🔥 Unique indices are handled at the field level with 'unique: true'

// 🔐 Password Hash
userSchema.pre("save", async function () {
  try {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    throw error;
  }
});

// 🔑 Compare Password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔐 Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      orgId: this.orgId,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn || "1d",
    },
  );
};

// 🔄 Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    config.jwt.secret,
    {
      expiresIn: config.refreshTokenExpiry || "7d",
    },
  );
};

export default mongoose.model("User", userSchema);
