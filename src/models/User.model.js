import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const UserSchema = new mongoose.Schema(
  {
    Username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    
    password: {
      type: String,
      required: [true, "password is require"],
    },
     refreshToken: {
            type: String
        },
  },
  {
    timestamps: true,
  }
)

//pre method run before saving the data
UserSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
    this.password= await bcrypt.hash(this.password,10)
    next();
})

UserSchema.methods.ispasswordcorrect= async function(password){
 return await bcrypt.compare(password,this.password)
}

UserSchema.methods.genrateTokenAccess= function(){
  return jwt.sign(
    {
      _id:this._id,
      email:this.email,
      fullName:this.fullName,
      username:this.username,
    },
    process.env.ACCES_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCES_TOKEN_EXPIRY
    }
  )
}
UserSchema.methods.genrateRefreshToken=function(){
 return jwt.sign(
    {
      _id:this._id,
      
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}


export const User = mongoose.model("User", UserSchema);
