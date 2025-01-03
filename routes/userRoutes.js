import express from "express";
import { protectedMiddleware, isAdmin, verifiedMiddleware } from "../middleware/authMiddleware.js";
import { allUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/",protectedMiddleware,isAdmin, allUser)
router.get("/verified", protectedMiddleware, verifiedMiddleware, (req,res) => {
  return res.status(200).json({
    message: "User Verified"
  })
})


export default router; 