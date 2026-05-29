import { PNG } from "pngjs";
import { TDecodedPayload } from "../../types/type";
import { bitsToByte, bitsToNumber } from "../../util/helpers";

const decodeLSB = async (stegImageBuffer: Buffer): Promise<TDecodedPayload> => {
  // Decode PNG
  const png = PNG.sync.read(stegImageBuffer);

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

  // First 32 bits = payload length
  const headerBits = extractedBits.slice(0, 32);

  // Convert header bits back to number
  let payloadLength = bitsToNumber(headerBits, 32);

  // Extract actual payload bits
  const payloadBits = extractedBits.slice(32, 32 + payloadLength);

  // Convert bits -> bytes
  const payloadBytes = bitsToByte(payloadBits);

  // Convert bytes -> Buffer
  const payloadBuffer = Buffer.from(payloadBytes);

  const payloadStr = payloadBuffer.toString();

  const payloadJson = JSON.parse(payloadStr) as TDecodedPayload;

  return payloadJson;
};

export default decodeLSB;
