import asyncHandler from "../middleware/asyncHandler.js"
import User from "../models/User.js"

export const registerUser = asyncHandler(async(req, res, ) => {
    const isFirstUser = (await User.countDocuments()) ===0 ? 'admin' : "user"
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: isFirstUser
    })

    res.status(201).json({
      message: "Register Success",
      user
    })
  
})

export const loginUser = asyncHandler(async(req,res)=>{
  // 1. buat validasi
  if(!req.body.email && !req.body.password){
    res.status(400)
    throw new Error("Email and Password is required")
  }
  // 2. buat kondisi bagaimana jika emamil dan password yang dimasukkan salah
  const userData = await User.findOne({
    email:req.body.email
  })
  if(!userData && (await userData.comparePassword(req.body.password))){
    res.status(400)
    throw new Error("User not found")
  }
  res.status(200),json({
    message :"Login Success",
    
  })
})