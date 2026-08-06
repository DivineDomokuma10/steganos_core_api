import { config } from "@/config";
import { IRefreshJwtPayload } from "@/types/interface";
import { createToken, verifyJwt } from "@/services/auth/verify-create-jwt";
import RefreshTokenModel from "@/model/refresh-token.model";

import { uuid } from "@/util/helpers";
import { compare, hasher } from "@/util";
import { REFRESH_TOKEN_TTL } from "@/util/constants";

export async function refreshTokenRotator(oldToken: string) {
  const decoded = verifyJwt<IRefreshJwtPayload>(
    oldToken,
    config.refreshTokenSecret,
  );

  const { userId, jti } = decoded;

  const tokenDoc = await RefreshTokenModel.findOne({ tokenId: jti });

  if (!tokenDoc) {
    throw new Error("TOKEN_NOT_FOUND");
  }

  if (tokenDoc.expiresAt < new Date()) {
    throw new Error("TOKEN_EXPIRED");
  }

  const isValid = await compare(oldToken, tokenDoc.tokenHash);

  if (!isValid) {
    // strong signal of compromise
    await RefreshTokenModel.updateMany({ userId }, { revoked: true });
    throw new Error("TOKEN_TAMPERED");
  }

  // atomic revoke
  const updated = await RefreshTokenModel.findOneAndUpdate(
    { tokenId: jti, revoked: false },
    { revoked: true },
    { new: true },
  );

  if (!updated) {
    throw new Error("TOKEN_ALREADY_USED");
  }

  const newTokenId = uuid();

  const { token: accessToken } = createToken({ userId }, "access");

  const { token: refreshToken } = createToken<IRefreshJwtPayload>(
    { userId, jti: newTokenId },
    "refresh",
  );

  const hashedRefreshToken = await hasher(refreshToken);

  await RefreshTokenModel.create({
    userId,
    tokenId: newTokenId,
    tokenHash: hashedRefreshToken,
    revoked: false,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });

  return { accessToken, refreshToken };
}
