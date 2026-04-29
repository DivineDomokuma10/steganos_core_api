import { Router } from "express";
import loginController from "../controllers/auth/login";
import refreshController from "../controllers/auth/refresh";
import registerController from "../controllers/auth/register";

const router = Router();

router.post("/login", loginController);
router.get("/refresh", refreshController);
router.post("/register", registerController);

export default router;
