import { Request, Response } from "express";

import encodeLSB from "@/services/steg/encode-steg";

import { apiResponse } from "@/util";
import { IMAGE_MAX_SIZE, MESSAGE_MAX_LENGTH } from "@/util/constants";
import { jsonToBits, toSizeUnit } from "@/util/helpers";

const encodeController = async (req: Request, res: Response) => {
  const image = req.file;

  if (!image) {
    apiResponse(res, 404, {
      status: "error",
      message: "No Image Uploaded",
    });

    return;
  }

  if (image.mimetype !== "image/png") {
    apiResponse(res, 400, {
      status: "error",
      message: "Invalid Image format. Allowed format is PNG",
    });

    return;
  }

  if (toSizeUnit(image.size, "MB") > IMAGE_MAX_SIZE) {
    apiResponse(res, 400, {
      status: "error",
      message: "Image size too large. Max size 10MB",
    });

    return;
  }

  const payload = req.body;

  if (!Object.keys(payload).length) {
    apiResponse(res, 400, {
      status: "error",
      message: "Payload cannot be empty",
    });

    return;
  }

  const REQUIRED_FIELDS = ["iv", "salt", "ciphertext"] as const;

  const missingField = REQUIRED_FIELDS.find(
    (field) =>
      typeof payload[field] !== "string" || !(payload[field] as string).trim(),
  );

  if (missingField) {
    apiResponse(res, 400, {
      status: "error",
      message: `Missing or invalid payload field: ${missingField}`,
    });

    return;
  }

  const payloadBits = jsonToBits(payload);

  if (payloadBits.length > MESSAGE_MAX_LENGTH * 8) {
    apiResponse(res, 400, {
      status: "error",
      message: "Message too large. Max message size is 512KB",
    });

    return;
  }

  const stegImage = await encodeLSB(image.buffer, payloadBits);

  if (toSizeUnit(stegImage.length, "MB") > IMAGE_MAX_SIZE) {
    apiResponse(res, 400, {
      status: "error",
      message: "Encoded image exceeds the 10MB size limit",
    });

    return;
  }

  res.setHeader("Content-Type", "image/png");

  res.send(stegImage);
};

export default encodeController;
