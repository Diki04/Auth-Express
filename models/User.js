import mongoose from 'mongoose';
import validator from 'validator'
const { Schema } = mongoose;

const userSchema = new Schema({
  name:{
    type: String,
    required:[true, 'Username is required'],
    minlength:[ 3, 'Username must be at least 3 characters'],
  },
  email:{
    type: String,
    required:[true, 'Email is required'],
    validate:{
      validator: validator.isEmail,
      message: "Input is should be an email"
    },
    unique:true
  },
  password:{
    type: String,
    required:[true, 'Password is required'],
    minlength:[ 8, 'Password must be at least 8 characters']
  },
  role:{
    type:String,
    enum:["user", "admin"],
    default:"user"
  },
  isVerified:{
    type: Boolean,
    default: false
  },
  EmailVerfiedAt:{
    type: Date
  }
  
});
const User = mongoose.model("User", userSchema)
export default User;