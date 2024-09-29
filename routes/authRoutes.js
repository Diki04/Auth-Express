import express from "express";

const router = express.Router();

router.post("/login", (req, res) => {
  res.send("Login router")
})

router.post("/register", (req, res) => {
  res.send("register router")
})

router.post("/logout", (req, res) => {
  res.send("Logout router")
})
router.get("/getuser", (req, res) => {
  res.send("get user router")
})

export default router;