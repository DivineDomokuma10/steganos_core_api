import { Request, Response } from "express";

import encodeLSB from "../../services/steg/encode-steg";

import { apiResponse } from "../../util";
import { IMAGE_MAX_SIZE } from "../../util/constants";
import { jsonToBits, toSizeUnit } from "../../util/helpers";

const encodeController = async (req: Request, res: Response) => {
  try {
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

    const payloadBits = jsonToBits(payload);

    const stegImage = await encodeLSB(image.buffer, payloadBits);

    res.setHeader("Content-Type", "image/png");

    res.send(stegImage);
  } catch (error) {
    const err = error as Error;

    apiResponse(res, 500, {
      status: "error",
      message: err.message,
    });

    return;
  }
};

export default encodeController;
