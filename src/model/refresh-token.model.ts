import { model, Schema } from "mongoose";

import { IDbRefreshToken } from "../types/interface";

const refreshTokenSchema = new Schema<IDbRefreshToken>(
  {
    userId: { type: String, required: true, index: true },

    tokenId: { type: String, required: true, unique: true }, // jti

    tokenHash: { type: String, required: true },

    revoked: { type: Boolean, required: true, default: false },

    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshTokenModel = model("RefreshToken", refreshTokenSchema);

export default RefreshTokenModel;
