import { PNG } from "pngjs";
import { getCapacityBits, numberToBits } from "../../util.ts/helpers";

const encodeLSB = async (
  imageBuffer: Buffer,
  payloadBits: number[],
): Promise<Buffer> => {
  // Decode PNG
  const png = PNG.sync.read(imageBuffer);

  // Flattened RGBA pixel buffer
  const data = png.data;

  // Create 32-bit header
  const headerBits = numberToBits(payloadBits.length, 32);

  // Full payload
  const fullPayloadBits = [...headerBits, ...payloadBits];

  // Capacity check
  const capacityBits = getCapacityBits(data.length);

  if (fullPayloadBits.length > capacityBits) {
    throw new Error("Image too small for payload");
  }

  let bitIndex = 0;

  for (let i = 0; i < data.length; i++) {
    // Skip alpha channel
    if ((i + 1) % 4 === 0) continue;

    // Stop when finished
    if (bitIndex >= fullPayloadBits.length) break;

    // Replace LSB
    data[i] = (data[i] & 0b11111110) | fullPayloadBits[bitIndex];

    bitIndex++;
  }

  // Re-encode PNG
  const outputBuffer = PNG.sync.write(png);

  return outputBuffer;
};

export default encodeLSB;
