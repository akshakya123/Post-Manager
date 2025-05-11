const { createErrorResponse, createSuccessResponse } = require("../helpers/helpers");
const { userModel } = require("../models");
const modelServices = require("../services/modelServices");
const { USER_FOUND, USER_UPDATED_SUCESSFULLY, USER_NOT_UPDATED, USER_NOT_DELETED, USER_DELETED, LOGGED_IN_SUCESSFULLY, USER_NOT_FOUND, WRONG_PASSWORD, USER_NOT_VERIFIED, EMAIL_ALREADY_REGISTERED, EMAIL_SENT, WRONG_OTP, EMAIL_VERIFIED, EMAIL_SEND_FAIL, EMAIL_NOT_DEFINED, PASSWORD_RESET_SUCCESSFULLY } = require("../utils/messages");
const { compareHash, generateOTP, sendMailToVerify, hashPassword, sendMailToChangePassword } = require("../utils/utils");
const { generateToken, generateTokenforEmail, generateTokenforOtp } = require("../services/authServices");
const constants = require("../utils/constants");

let userControllers={};

userControllers.register = async (payload) => {
    const { email } = payload;

    const user=await modelServices.findOne(userModel,{
        email:email,isDeleted:false,isVerified:true
    })

    if(user){
        throw createErrorResponse(EMAIL_ALREADY_REGISTERED,constants.ERROR_TYPES.BAD_REQUEST)
    }
    console.log("Email in Register Function:", email);

    if (!email) {
        return createErrorResponse(EMAIL_NOT_DEFINED, constants.ERROR_TYPES.VALIDATION_ERROR);
    }

    const otp = generateOTP();
    const emailSent = await sendMailToVerify(email, otp);

    if (!emailSent) {
        throw createErrorResponse(EMAIL_SEND_FAIL, constants.ERROR_TYPES.INTERNAL_ERROR);
    }

    const authToken=generateTokenforOtp(otp);

    return createSuccessResponse(EMAIL_SENT,{authToken:authToken});
};


userControllers.verifyEmail=async(payload)=>{
    const {email,otp} = payload

    if(otp!=payload.user.otp){
        throw createErrorResponse(WRONG_OTP,constants.ERROR_TYPES.DATA_NOT_FOUND)
    }

    await modelServices.insertOne(userModel,{
        email:email,isDeleted:false,isVerified:true
    })

    const token=generateTokenforEmail(email);

    return createSuccessResponse(EMAIL_VERIFIED,{token:token})

}

userControllers.addDetails=async(payload)=>{
    const {name,gender,password} = payload;

    const hashedPass=hashPassword(password);

    const addDetails=await modelServices.findOneAndUpdate(userModel,{
        email:payload.user.email,isDeleted:false,isVerified:true
    },
    {
        $set:{name:name,gender:gender,password:hashedPass}
    })

    if(!addDetails){
        throw createErrorResponse(USER_NOT_VERIFIED,constants.ERROR_TYPES.DATA_NOT_FOUND)
    }

    return createSuccessResponse(USER_UPDATED_SUCESSFULLY)
}

userControllers.login = async (payload) => {
    const { email, password } = payload;

    const userExist = await modelServices.findOne(userModel, { email:payload.email ,isDeleted:false,isVerified:true},{email:1,password:1});

    if (!userExist) {
        throw createErrorResponse(USER_NOT_FOUND, constants.ERROR_TYPES.DATA_NOT_FOUND);
    }
    
   const pass=compareHash(password,userExist.password)
    if (!pass) {
        throw createErrorResponse(WRONG_PASSWORD,constants.ERROR_TYPES.UNAUTHORIZED);
    }

    if (userExist.isVerified==false) {
        throw createErrorResponse(USER_NOT_VERIFIED,constants.ERROR_TYPES.BAD_REQUEST);
    }

    const token = generateToken(userExist._id);

    return createSuccessResponse(LOGGED_IN_SUCESSFULLY, {token:token});
};

userControllers.getProfile=async(payload)=>{
    const user=await modelServices.findOne(userModel,{
        _id:payload.user.id,isDeleted:false
    },
    {
        name:1,email:1,gender:1
    })

    return createSuccessResponse(USER_FOUND,user)
}

userControllers.updateProfile=async(payload)=>{
    const {name,gender} = payload
    const user=await modelServices.findOneAndUpdate(userModel,{
        _id:payload.user.id,isDeleted:false
    },{
        $set:{name:name,gender:gender}
    })

    if(!user){
        createErrorResponse(USER_NOT_UPDATED,constants.ERROR_TYPES.BAD_REQUEST)
    }
    return createSuccessResponse(USER_UPDATED_SUCESSFULLY)
}

userControllers.deleteUser=async(payload)=>{
    const deletedUser=modelServices.findOneAndUpdate(userModel,{
        _id:payload.user.id,isDeleted:false
    },{
        $set:{isDeleted:true}
    })

    if(!deletedUser){
        createErrorResponse(USER_NOT_DELETED,constants.ERROR_TYPES.BAD_REQUEST)
    }
    return createSuccessResponse(USER_DELETED)
}

userControllers.forgotPassword=async(payload)=>{
    const {email}= payload;
    const user=await modelServices.findOne(userModel,{
        email:email,isVerified:true,isDeleted:false
    })

    if(!user){
        throw createErrorResponse(USER_NOT_FOUND,constants.ERROR_TYPES.DATA_NOT_FOUND)
    }

    const otp=generateOTP();
    
    sendMailToChangePassword(email,otp);

    const authToken=generateTokenforOtp(otp);

    return createSuccessResponse(EMAIL_SENT,{token:authToken})
    
}

userControllers.newPassword=async(payload)=>{
    const {email,otp,newPassword}=payload;

    if(otp!=payload.user.otp){
        throw createErrorResponse(WRONG_OTP,constants.ERROR_TYPES.UNAUTHORIZED)
    }

    const newHashedPassword=hashPassword(newPassword);

    const user=await modelServices.findOneAndUpdate(userModel,{
        email:email,isVerified:true,isDeleted:false
    },{
        $set:{password:newHashedPassword}
    },{
        new:true
    }
    )

    if(!user){
        throw createErrorResponse(USER_NOT_FOUND,constants.ERROR_TYPES.DATA_NOT_FOUND)
    }

    return createSuccessResponse(PASSWORD_RESET_SUCCESSFULLY,{newPassword:newPassword})
}

userControllers.resetPassword=async(payload)=>{
    const {oldPassword,newPassword}= payload;

    const user=await modelServices.findOne(userModel,{
        _id:payload.user.id,isDeleted:false,isVerified:true
    })

    if(!user){
        throw createErrorResponse(USER_NOT_FOUND,constants.ERROR_TYPES.DATA_NOT_FOUND)
    }

    const checkPassword=compareHash(oldPassword,user.password);

    if(!checkPassword){
        throw createErrorResponse(WRONG_PASSWORD,constants.ERROR_TYPES.UNAUTHORIZED)
    }
    const hashedPassword=hashPassword(newPassword)

    const updatedUser=await modelServices.findOneAndUpdate(userModel,{
        _id:payload.user.id,isDeleted:false,isVerified:true
    },{
        $set:{password:hashedPassword}
    },{
        new:true
    })

    if(!updatedUser){
        throw createErrorResponse(USER_NOT_FOUND,constants.ERROR_TYPES.DATA_NOT_FOUND)
    }

    return createSuccessResponse(PASSWORD_RESET_SUCCESSFULLY,{newPassword:newPassword})
}

module.exports=userControllers