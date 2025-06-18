import asynhandler from "../utils/asynchandler.js";
import { ApiError } from "../utils/Apierror.js";
import { User } from "../models/User.model.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import jwt from "jsonwebtoken";
const registerUser = asynhandler(async (req, res) => {
  const { fullName, Username, email, password } = req.body;
  // console.log("ms",req.body)
  if (
    [fullName, email, password, Username].some((filed) => filed?.trim() === "")
  ) {
    throw new ApiError(400, "All filed are require");
  }
  // if(Username=="Abhishek"){
  //   Username.replace("Abhishek","host")
  // }
  const existedUser = await User.findOne({
    $or: [{ Username }, { email }],
  });
  if(existedUser){
    throw new ApiError(409,"User with email are already exists")
  }





 const user=await User.create({
    fullName,
    email,
    password,
    Username:Username.toLowerCase()
 })

 const createUser=await User.findById(user._id).select(
  "-password -refreshToken"
 )
 if(!createUser){
  throw new ApiError(500,"something went wrong in register User")
 }
   return res.status(201).json(
        new Apiresponse(200, createUser, "User registered Successfully")
    )
});




const refreshandaccessToken= async(userid)=>{
    try {
      const user=await User.findById(userid)
        const accessToken=user.genrateTokenAccess()
    const refreshToken=user.genrateRefreshToken()   
    user.refreshToken=refreshToken;
 

    user.save({validBeforeSave:false})
    return {accessToken,refreshToken}
  
    } catch (error) {
      throw new ApiError(404,error)
    }
}
const loginUser=asynhandler(async(req,res)=>{


  const {Username,email,password}=req.body;
  if(!Username && !email){
    throw new ApiError(404, "Username or email not found")
  }
  const user=await User.findOne({
    $or:[{Username},{email}]
  })
    if(!user){
    throw new ApiError(404, "Username or email dosnot existed")

    }
    const ispassword= await user.ispasswordcorrect(password)
    if(!ispassword){
      throw new ApiError(404,"password is wrong")
    }
 const {refreshToken,accessToken} = await refreshandaccessToken(user._id)
    const loginUser= await User.findById(user._id)

    const option={
      httpOnly:true,
      secure:true
    }
  
    return res.status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json(
      new Apiresponse(
        200,{
         user: accessToken,refreshToken,loginUser,
         

        },req.headers,
        "User login successfully"

      )
    )
})

const logOutUser=asynhandler((req,res)=>{
      User.findByIdAndUpdate(
        
          req.user_id,
        {
          $set:{
                refreshToken:undefined
          }
          
        },
        {
            new:true,
          }
      )
       const option={
      httpOnly:true,
      secure:true
    }
   return res.status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken",option)
    .json(new Apiresponse(200,{},"User logout successfully"))
})
const AccessRefreshToken=asynhandler(async(req,res)=>{
   try {
     const incomingRefreshToken=req.cookies.refreshToken|| req.body.refreshToken;
     if(!incomingRefreshToken){
       throw new ApiError(401,"unauthorized token")
     }
 
    const decodedToken= jwt.verify(incomingRefreshToken,  process.env.REFRESH_TOKEN_SECRET)
 
    const user= await User.findById(decodedToken?._id)
 
    if(!user){
     throw new ApiError(401,"not find id")
    }
 
    let option={
      httpOnly:true,
      secure:true
    }
   
    if(incomingRefreshToken !== user?.refreshToken){
     throw new ApiError(401,"refresh token are expired")
    }
   const {accessToken,newrefreshToken}= await refreshandaccessToken(user._id)
    res.status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",newrefreshToken,option)
    .json(
      new Apiresponse(200, {accessToken,newrefreshToken,} , "access token refreshed successfully")
    )
   } catch (error) {
  throw new  ApiError(401,error?.message || "Invalid Refresh Token")
   }


   
})

const changeCurrentPassword=asynhandler(async(req,res)=>{
    const {oldpassword,newPassword,confPassword}=req.body;
  const user=User.findById(req.user._id)
  const ispassowrdCorrect=  user.ispasswordcorrect(oldpassword)
    if(!ispassowrdCorrect){
      throw new ApiError(404,"old pass is invalid")
    }
    
    user.password=newPassword
    if(newPassword !== confPassword){
      throw new ApiError(404,"confrom pass is invalid")
    }
    user.save({validBeforeSave:true})
    res.status(200)
    .json(new Apiresponse(200,{},"password successfully"))
})
const getCurrentUser=asynhandler(async(req,res)=>{
    res.status(200)
    .json(
      new Apiresponse(200,req.user,"current user fetch successfully")
    )
})

const updateUser=asynhandler(async(req,res)=>{
  const {fullName,email}=req.body

  if(!fullName || !email){
    throw new ApiError(401,"fullname or username is requireds")
  }
 const user= User.findByIdAndUpdate(req.user?._id,
  {
    $set:{
        fullName,
        email,
    }
  }
 )
})

export { 
  registerUser,
  loginUser,
  logOutUser,
  AccessRefreshToken,
  changeCurrentPassword,
  updateUser,
  getCurrentUser

 };
