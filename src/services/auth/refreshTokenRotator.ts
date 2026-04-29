import { config } from "../../config";
import { IRefreshJwtPayload } from "../../types/interface";
import { createToken, verifyJwt } from "./verify-create-jwt";
import RefreshTokenModel from "../../model/refresh-token.model";

import { uuid } from "../../util.ts/helpers";
import { compare, hasher } from "../../util.ts";
import { REFRESH_TOKEN_TTL } from "../../util.ts/constants";

export async function refreshTokenRotator(oldToken: string) {
  const decoded = verifyJwt<IRefreshJwtPayload>(
    oldToken,
    config.refreshTokenSecret,
  );

  const { userId, jti } = decoded;

  const tokenDoc = await RefreshTokenModel.findOne({
    tokenId: jti,
  });

  if (!tokenDoc || tokenDoc.revoked) {
    await RefreshTokenModel.updateMany({ userId }, { revoked: true });
    throw new Error("TOKEN_REUSE_DETECTED");
  }

  if (tokenDoc.expiresAt < new Date()) {
    await RefreshTokenModel.updateMany({ userId }, { revoked: true });
    throw new Error("TOKEN_EXPIRED");
  }

  const isValid = await compare(oldToken, tokenDoc.tokenHash);

  if (!isValid) {
    await RefreshTokenModel.updateMany({ userId }, { revoked: true });
    throw new Error("TOKEN_TAMPERED");
  }

  await RefreshTokenModel.updateOne({ tokenId: jti }, { revoked: true });

  const newTokenId = uuid();

  const { token: accessToken } = createToken({ userId }, "access");

  const { token: refreshToken } = createToken<IRefreshJwtPayload>(
    {
      userId,
      jti: newTokenId,
    },
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
