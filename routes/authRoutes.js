import express from "express";
import User from "../models/User.js";
import { registerUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", (req, res) => {
  res.send("Login router")
})

router.post("/register", registerUser )

router.post("/logout", (req, res) => {
  res.send("Logout router")
})
router.get("/getuser", (req, res) => {
  res.send("get user router")
})

export default router;