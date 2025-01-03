import express from "express";
import { registerUser, loginUser,currentUser,logoutUser, generateCodeUser, verifiedUser, refreshTokenUser } from "../controllers/authController.js";
import { protectedMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginUser)

router.post("/register", registerUser )

router.post("/logout",protectedMiddleware,logoutUser)

router.get("/getuser",protectedMiddleware, currentUser )

router.post("/generate-otp-code", protectedMiddleware, generateCodeUser)

router.post("/verified-user", protectedMiddleware, verifiedUser)

router.post("/refresh-token", protectedMiddleware, refreshTokenUser )

export default router;