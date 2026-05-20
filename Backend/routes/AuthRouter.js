import express from "express";
import { signUp, login } from "../Controller/AuthController.js";
import {
    signUpValidation,
    loginValidation,
} from "../Middlewares/AuthValidation.js";
import { refreshTokenController } from "../Controller/refreshTokenController.js";
import { fcmTokenHandler } from "../Controller/FcmTokenHandler.js";

const router = express.Router();

router.post("/signUp", signUpValidation, signUp);
router.post("/login", loginValidation, login);
router.post("/refresh", refreshTokenController);
router.post("/fcmTokenHandler", fcmTokenHandler);

export default router;
