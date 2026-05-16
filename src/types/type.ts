export type TApiSuccess<T> = {
  data: T;
  message: string;
  status: "success";
};

export type TApiError = {
  message: string;
  status: "error";
};

export type TDataSizeUnit = "KB" | "MB" | "GB";

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type TApiResponse<T> = TApiSuccess<T> | TApiError;
