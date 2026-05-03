export interface IUser {
  email: string;
  username: string;
  password: string;
  termsAndCondition: boolean;
}

export interface ICreateTokenReturns {
  token: string;
}

export interface IJwtPayload {
  userId: string;
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
