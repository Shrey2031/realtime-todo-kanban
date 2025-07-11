import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/apiResponce.js';
import jwt from 'jsonwebtoken';


const generateAccessAndRefreshToken = async(userId) =>{
    try {
       const user = await User.findById(userId)
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

       user.refreshToken = refreshToken;
      await  user.save({validateBeforeSave: false})

       return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,'something went wrong while generating refresh and access token')
    }
}

const registerUser = asyncHandler(async (req,resp) => {
   // get user details from frontend
   //validation - not empty
   // check if user already exists: username, email
   // create user object - create entry in db
   // remove password and refresh token field from response
   //check for user creation
   // return res

   const {name,email,password} = req.body
   console.log("email: ",email);
//    console.log(req.file);

   if(
       [name,email,password].some((field) => field?.trim() === "" )

   ){
             throw new ApiError (400,"all fields are mandatory")
   }

   const existedUser = await User.findOne({
     $or: [{ name: name }, { email: email }] 
    })

    if(existedUser){
        throw new  ApiError(409, "user with email and password already exist")
    }

  

     const user = await User.create({
        name,
        email,
        password
    
    })

    const createdUser = await  User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "user not found")
    }

    return resp.status(201).json(
        new ApiResponse(200,createdUser,"user register successfully")
    )



})

const loginUser = asyncHandler(async(req,resp) => {
   // req.body -> data
   //username or  email
   // find the user
   // password check
   // access and refresh token
   // send cookie


   const {email,password} = req.body;
   console.log(email);
   if( !email){
    throw new ApiError(400,' email is required')
   }

   const user = await User.findOne({
    $or:[{email}]
   })

   if(!user){
    throw new ApiError(404,'user does not exist')
   }

   const isPasswordValid = await user.isPasswordCorrect(password);
   if(!isPasswordValid){
    throw new ApiError(401,'invalid password')
   }

   const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",           // ✅ Needed for cross-origin
    maxAge: 7 * 24 * 60 * 60 * 1000 // 
   }

   return resp.status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
     new ApiResponse(
        200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "user login Successfully"
     )
   )
   
})

const logoutUser = ( async (req,resp) => {
    await  User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken: 1
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    
       }

   return resp.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logged Out"))

})

const refreshAccessToken = asyncHandler(async (req,resp) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }

   try {
    const decodedToken =  jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_SECRET
 
     )
 
     const user = User.findById(decodedToken?._id);
 
     if(!user){
         throw new ApiError("invalid refreshToken")
     }
 
     if(incomingRefreshToken !== user?.refreshToken){
         throw new ApiError(401,"Refresh Token is expired or used")
     }
 
     const options ={
         httpOnly: true,
         secure: true
     }
 
    const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    return resp.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
     new ApiResponse(
        200,
        
            {accessToken, refreshToken:newRefreshToken},
            "access Token refreshed"
        
        
     )
   )
   } catch (error) {
      throw new ApiError(401,error?.message || "Invalid refresh Token")
   }



})


export {
    registerUser,
    loginUser,
    logoutUser,
    generateAccessAndRefreshToken,
    refreshAccessToken
}