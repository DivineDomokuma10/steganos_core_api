import {
  readPng,
  bitsToByte,
  bitsToNumber,
  isValidPayloadJson,
} from "@/util/helpers";
import { AppError } from "@/util/errors";
import { TDecodedPayload } from "@/types/type";

const decodeLSB = async (stegImageBuffer: Buffer): Promise<TDecodedPayload> => {
  // Decode PNG
  const png = readPng(stegImageBuffer);

  // Flattened RGBA buffer
  const data = png.data;

  // Store extracted bits
  const extractedBits: number[] = [];

  // Traverse pixels exactly like encoder
  for (let i = 0; i < data.length; i++) {
    // Skip alpha channel
    if ((i + 1) % 4 === 0) continue;

    // Extract LSB
    extractedBits.push(data[i] & 1);
  }

  // Not enough bits to even hold a 32-bit header
  if (extractedBits.length < 40) {
    throw new AppError(400, "No steganographic payload found");
  }

  // First 32 bits = payload length
  const headerBits = extractedBits.slice(0, 32);

  // Convert header bits back to number
  const payloadLength = bitsToNumber(headerBits, 32);

  // Payload is always byte-aligned; a bogus header should be rejected
  if (payloadLength <= 0 || payloadLength % 8 !== 0) {
    throw new AppError(400, "No steganographic payload found");
  }

  // Header must not declare more bits than the image actually holds
  if (32 + payloadLength > extractedBits.length) {
    throw new AppError(400, "Corrupted steganographic payload");
  }

  // Extract actual payload bits
  const payloadBits = extractedBits.slice(32, 32 + payloadLength);

  // Convert bits -> bytes
  const payloadBytes = bitsToByte(payloadBits);

  // Convert bytes -> Buffer
  const payloadBuffer = Buffer.from(payloadBytes);

  const payloadStr = payloadBuffer.toString();

  let payloadJson: unknown;

  try {
    payloadJson = JSON.parse(payloadStr);
  } catch {
    throw new AppError(400, "No valid steganographic payload found");
  }

  const isValidPayload = isValidPayloadJson(payloadJson);

  if (!isValidPayload) {
    throw new AppError(400, "No valid steganographic payload found");
  }

  return payloadJson as TDecodedPayload;
};

export default decodeLSB;
