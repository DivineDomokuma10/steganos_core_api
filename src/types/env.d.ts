declare namespace NodeJS {
  interface ProcessEvn {
    PORT: string;
    MONGO_URI: string;
    SALTROUNDS: number;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRE_TIME: string;
    REFRESH_TOKEN_EXPIRE_TIME: string;
    NODE_ENV: "development" | "production";
  }
}
