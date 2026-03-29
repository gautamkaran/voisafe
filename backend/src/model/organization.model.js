// models/Organization.js
import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    address: {
      type: String,
    },

    logo: {
      type: String, // URL
    },

    banner: {
      type: String, // URL
    },

    domain: {
      type: String,
      required: true,
      unique: true, // important for student email validation
      lowercase: true,
    },

    collegeCode: {
      type: String,
      required: true,
      unique: true, // extra security
    },

    typeOfOrg: {
      type: String,
      enum: ["college", "school", "ngo"],
      default: "college",
    },

    status: {
      type: String,
      enum: ["pending", "active", "rejected"],
      default: "pending",
    },

    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
    },

    socialMediaLink: {
      website: String,
      linkedin: String,
      twitter: String,
    },
  },
  { timestamps: true },
);

// 🔥 Unique indices are handled at the field level with 'unique: true'

export default mongoose.model("Organization", organizationSchema);
