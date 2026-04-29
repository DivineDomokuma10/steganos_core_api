import { randomUUID } from "node:crypto";
import { Prettify } from "../types/type";

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
