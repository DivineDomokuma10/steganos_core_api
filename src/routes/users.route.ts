import { Router } from "express";

import { asyncHandler } from "@/util";
import { getProfile } from "@/controllers/user.controller";

const router = Router();

router.get("/me/", asyncHandler(getProfile));

export default router;
