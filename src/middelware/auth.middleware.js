import jwt from "jsonwebtoken"
import asynhandler from "../utils/asynchandler.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/Apierror.js";

export const  verifyjwt=asynhandler(async(req,res,next)=>{
      try {
          const token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","")
          if(!token){
              throw new ApiError(404,"token not existed")
          }
          const decodedToken=jwt.verify(token,process.env.ACCES_TOKEN_SECRET)
        const user= await User.findById(decodedToken?._id).select("-password -refreshToken")
         if(!user){
          throw new ApiError(401,"access token error")
         }
         req.user=user;
         next()
      } catch (error) {
        throw new ApiError(404,error?.message || "inavlid access token")
      }
})
