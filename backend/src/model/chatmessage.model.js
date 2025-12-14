// models/Chat.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },

    senderRole: {
      type: String,
      enum: ["student", "admin", "committee"],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

chatSchema.index({ complaintId: 1 });

export default mongoose.model("Chat", chatSchema);
