import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", (req, res) => {
  res.send("Login router")
})

router.post("/register", async(req, res) => {
  try{
    await User.create(req.body)
  }catch(error){
    res.status(422).json({
      error
    })
  }
})

router.post("/logout", (req, res) => {
  res.send("Logout router")
})
router.get("/getuser", (req, res) => {
  res.send("get user router")
})

export default router;