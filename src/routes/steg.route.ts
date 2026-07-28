import { Router } from "express";

import { asyncHandler } from "../util";
import encodeController from "../controllers/steg/encode";
import decodeController from "../controllers/steg/decode";

const router = Router();

router.post("/encode", asyncHandler(encodeController));
router.post("/decode", asyncHandler(decodeController));

export default router;
