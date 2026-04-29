import { Router } from "express";
import loginController from "../controllers/auth/login";
import registerController from "../controllers/auth/register";
import { refreshController } from "../controllers/auth/refresh";

const router = Router();

router.post("/login", loginController);
router.get("/refresh", refreshController);
router.post("/register", registerController);

export default router;
