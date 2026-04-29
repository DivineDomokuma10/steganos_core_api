export interface IUser {
  email: string;
  username: string;
  password: string;
}

export interface ICreateTokenReturns {
  token: string;
}

export interface IJwtPayload {
  userId: string;
  email: string;
}

export interface IRefreshJwtPayload extends IJwtPayload {
  jti: string;
}

export interface IDbRefreshToken {
  userId: string;
  tokenId: string;
  tokenHash: string;
  revoked: boolean;
  expiresAt: Date;
}
