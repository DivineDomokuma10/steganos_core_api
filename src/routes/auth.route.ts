import { Router } from "express";

import { asyncHandler } from "../util";
import loginController from "../controllers/auth/login";
import logoutController from "../controllers/auth/logout";
import refreshController from "../controllers/auth/refresh";
import registerController from "../controllers/auth/register";

const router = Router();

router.post("/login", asyncHandler(loginController));
router.get("/logout", asyncHandler(logoutController));
router.get("/refresh", asyncHandler(refreshController));
router.post("/register", asyncHandler(registerController));

export default router;
