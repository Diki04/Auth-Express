import mongoose from 'mongoose';
const { Schema } = mongoose;

const otpCodeSchema = new Schema({
 user:{
  type:mongoose.Schema.Types.ObjectId,
  ref: 'User'
 },
 otp: {
  type: String,
  required: [true, "Otp code is required"]
 },
 validUntil:{
  type: Date,
  required: true,
  expires:300
 }
});



const Otpcode = mongoose.model("Otpcode", otpCodeSchema)
export default Otpcode;