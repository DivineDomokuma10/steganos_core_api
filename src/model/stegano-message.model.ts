import mongoose from "mongoose";

const stegoMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    originalFileName: String,
    stegoImagePath: String,
    messageLength: Number,
    encryptionUsed: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["encoded", "decoded"],
    },
  },
  { timestamps: true },
);

export const SteganoMessage = mongoose.model(
  "StegoMessage",
  stegoMessageSchema,
);
