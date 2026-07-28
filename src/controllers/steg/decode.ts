import { Request, Response } from "express";

import { apiResponse } from "@/util/";
import { toSizeUnit } from "@/util/helpers";
import { IMAGE_MAX_SIZE } from "@/util/constants";

import decodeLSB from "@/services/steg/decode-steg";

const decodeController = async (req: Request, res: Response) => {
  const stegImage = req.file;

  if (!stegImage) {
    apiResponse(res, 404, {
      status: "error",
      message: "No Image Uploaded",
    });

    return;
  }

  if (stegImage.mimetype !== "image/png") {
    apiResponse(res, 400, {
      status: "error",
      message: "Invalid Image format. Allowed format is PNG",
    });

    return;
  }

  if (toSizeUnit(stegImage.size, "MB") > IMAGE_MAX_SIZE) {
    apiResponse(res, 400, {
      status: "error",
      message: "Image size too large. Max size 10MB",
    });

    return;
  }

  const payload = await decodeLSB(stegImage.buffer);

  apiResponse(res, 200, {
    status: "success",
    data: payload,
    message: "Steg-image decoded successfully",
  });

  return;
};

export default decodeController;
