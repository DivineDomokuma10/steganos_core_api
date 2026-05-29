import { Router } from "express";

import loginController from "../controllers/auth/login";
import logoutController from "../controllers/auth/logout";
import refreshController from "../controllers/auth/refresh";
import registerController from "../controllers/auth/register";

const router = Router();

router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/refresh", refreshController);
router.post("/register", registerController);

export default router;
