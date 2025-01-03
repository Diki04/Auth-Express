import asyncHandler from "../middleware/asyncHandler.js"
import User from "../models/User.js"
import jwt from "jsonwebtoken"
import sendEmail from "../utils/sendEmail.js"
import Otpcode from "../models/Otpcode.js"

const signToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: "1h"
  })
}

const generateRefreshToken = (id) => {
  return jwt.sign({id}, process.env.JWT_TOKEN_REFRESH, {
    expiresIn: "7d"
  })
}

const createResToken = async (user, statusCode, res) => {
  
  const accessToken = signToken(user._id)
  const refreshToken = generateRefreshToken(user._id)

  await User.findByIdAndUpdate(user._id,{
    refreshToken : refreshToken
  })

  const cookieOptionToken = {
    expires: new Date(
      Date.now()+ 24*60*60*1000
  ),
  httpOnly: true,
  security: false
  }

  const cookiesOptionRefresh = {
    expires: new Date(
      Date.now()+ 6*24*60*60*1000
    ),
    httpOnly: true,
    security: false
  }

  res.cookie('jwt', accessToken, cookieOptionToken)
  res.cookie('refreshToken', refreshToken, cookiesOptionRefresh)

  user.password = undefined

  res.status(statusCode).json({
    user
  })
}

export const registerUser = asyncHandler(async(req, res, ) => {
    const isFirstUser = (await User.countDocuments()) ===0 ? 'admin' : "user"
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: isFirstUser
    })

    const otpData = await user.generateOtpCode()

    await sendEmail({
      to: user.email,
      subject: "Registration Success",
      html:`
     <!doctype html>
        <html>
          <head>
            <meta http-equiv=3D"Content-Type" content=3D"text/html; charset=3DUTF-8">
          </head>
          <body style=3D"font-family: sans-serif;">
            <div style=3D"display: block; margin: auto; max-width: 600px;" class=3D"main">
              <h1 style=3D"font-size: 18px; font-weight: bold; margin-top: 20px">Congrats for ${user.name} getting registered!</h1>
              <p>Please use otp code to verify your email, your expires in 5 minutes</p>
              <p style ="text-align: center; background-color:green; font-wight: bold; font-size: 30px ">${otpData.otp}</p>
            </div>
          </body>
        </html>
      `
    })

   createResToken(user, 201, res)
  
})

export const generateCodeUser = asyncHandler(async(req,res) => {
  const currentUser = await User.findById(req.user._id)

  const otpData = await currentUser.generateOtpCode()

  await sendEmail({
    to: currentUser.email,
    subject: "Generate Code Success",
    html:`
   <!doctype html>
      <html>
        <head>
          <meta http-equiv=3D"Content-Type" content=3D"text/html; charset=3DUTF-8">
        </head>
        <body style=3D"font-family: sans-serif;">
          <div style=3D"display: block; margin: auto; max-width: 600px;" class=3D"main">
            <h1 style=3D"font-size: 18px; font-weight: bold; margin-top: 20px">Congrats for ${currentUser.name} generating code!</h1>
            <p>Please use otp code to verify your email</p>
            <p style ="text-align: center; background-color:green; font-wight: bold; font-size: 30px ">${otpData.otp}</p>
            <strong style="font-size: 12px;">OTP Code will expire in 5 minutes</strong>
          </div>
        </body>
      </html>
    `
  })
 return res.status(200).json({
    message: "Generate Code Success"
  })

})

export const verifiedUser = asyncHandler(async(req,res) => {
  // Validasi 1 jika user tidak memasukkan otp
  if(!req.body.otp){
    res.status(400)
    throw new Error("OTP is required")
  }

  // Validasi 2 jika otp tidak ditemukan
  const otp_code = await Otpcode.findOne({
    otp: req.body.otp,
    user: req.user._id
  })
  if(!otp_code){
    res.status(400)
    throw new Error("OTP not found")
  }

  // Update nilai User
  const userData = await User.findById(req.user._id)

  await User.findByIdAndUpdate(userData._id,{
    isVerified : true,
    EmailVerfiedAt : Date.now()
})

  return res.status(200).json({
    message: "User Verified"
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
    email: req.body.email
  })
  if(userData && (await userData.comparePassword(req.body.password))){
   createResToken(userData, 200, res)

  }else{
    res.status(400)
    throw new Error("User not found")
  }
  
})

export const currentUser = asyncHandler(async(req,res)=>{
  const user = await User.findById(req.user.id).select('-password')
  if(user){
    res.status(200).json({
      user
    })
  }else{
    res.status(401)
    throw new Error("User not found")
  }
})

export const logoutUser = async (req,res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expire: new Date(Date.now())
  })

  await User.findByIdAndUpdate(req.user._id, {
    refreshToken: null
  })

  res.cookie('refreshToken', '', {
    httpOnly: true,
    expire: new Date(Date.now())
  })

  res.status(200).json({
    message: "Logout success"
  })
}

export const refreshTokenUser = asyncHandler(async(req,res) => {
  const refreshToken = req.cookies.refreshToken

  if(!refreshToken){
    res.status(401)
    throw new Error("Refresh token not found")
  }

  const user = await User.findOne({refreshToken})
  if(!user){
    res.status(401)
    throw new Error("Invalid refresh token")
  }

  jwt.verify(refreshToken, process.env.JWT_TOKEN_REFRESH, (err, decoded) =>{
    if(err){
      res.status(401)
      throw new Error("Invalid refresh token")
    }

    // const newToken = generateRefreshToken(decoded.id)
    createResToken(user, 200, res)
    
  })
})