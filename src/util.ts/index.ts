import bcrypt from "bcrypt";
import { Prettify } from "../types/type";

export async function hasher(pwd: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pwd, salt);
}

export async function compare(pwd: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(pwd, hash);
}

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

const obj = {
  a: 1,
  b: 2,
  c: 3,
};

const obj2 = extractor(obj, "a");
