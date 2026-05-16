import { randomUUID } from "node:crypto";
import { Prettify, TDataSizeUnit } from "../types/type";

export function extractor<T, K extends keyof T>(
  object: T,
  props: K | K[],
): Prettify<Pick<T, K>> {
  const extractObject = {} as Pick<T, K>;

  if (Array.isArray(props)) {
    for (const prop of props) {
      extractObject[prop] = object[prop];
    }
  } else {
    extractObject[props] = object[props];
  }

  return extractObject;
}

export function uuid() {
  return randomUUID();
}

export const toSafeBuffer = (data: Uint8Array) => Uint8Array.from(data);

export function toSizeUnit(sizeInByte: number, unit: TDataSizeUnit): number {
  switch (unit) {
    case "KB":
      return sizeInByte / 1024;

    case "MB":
      return sizeInByte / 1024 ** 2;

    case "GB":
      return sizeInByte / 1024 ** 3;

    default:
      return sizeInByte;
  }
}

export function bufferToBits(buffer: Buffer): number[] {
  const bits: number[] = [];

  for (const byte of buffer) {
    for (let i = 7; i >= 0; i--) {
      bits.push((byte >> i) & 1);
    }
  }

  return bits;
}

export function jsonToBits(jsonObject: Record<string, string>) {
  const jsonStr = JSON.stringify(jsonObject);

  return bufferToBits(Buffer.from(jsonStr, "utf-8"));
}

export function numberTo32Bits(num: number): number[] {
  const bits: number[] = [];

  for (let i = 31; i >= 0; i--) {
    bits.push((num >> i) & 1);
  }

  return bits;
}

export function getCapacityBits(dataLength: number) {
  const pixels = Math.floor(dataLength / 4);

  return pixels * 3;
}
