const { createErrorResponse, createSuccessResponse } = require("../helpers/helpers");
const { userModel } = require("../models");
const modelServices = require("../services/modelServices");
const { USER_FOUND, USER_UPDATED_SUCESSFULLY, USER_NOT_UPDATED, USER_NOT_DELETED, USER_DELETED, LOGGED_IN_SUCESSFULLY, USER_NOT_FOUND, WRONG_PASSWORD, USER_NOT_VERIFIED, EMAIL_ALREADY_REGISTERED, EMAIL_SENT, WRONG_OTP, EMAIL_VERIFIED, EMAIL_SEND_FAIL, EMAIL_NOT_DEFINED, PASSWORD_RESET_SUCCESSFULLY, USER_REGISTER } = require("../utils/messages");
const { compareHash, generateOTP, sendMailToVerify, hashPassword, sendMailToChangePassword } = require("../utils/utils");
const { generateToken, generateTokenforEmail, generateTokenforOtp } = require("../services/authServices");
const constants = require("../utils/constants");

let userControllers={};

userControllers.register = async (payload) => {
    let { name, email, password, gender, role } = payload;

    const user = await modelServices.findOne(userModel, {email:email});

    if (user && !user.isDeleted) {
        throw createErrorResponse(EMAIL_ALREADY_REGISTERED, constants.ERROR_TYPES.BAD_REQUEST);
    }

    password = hashPassword(password);

    await modelServices.findOneAndUpdate(userModel, { email: email }, { $set:{name, password, gender, role} }, { upsert: true, new: true });

    return createSuccessResponse(USER_REGISTER);
};


userControllers.login = async (payload) => {
    const { email, password } = payload;

    const user=await modelServices.findOne(userModel,{email})

    if (!user||(user && user.isDeleted)) {
        throw createErrorResponse(USER_NOT_FOUND, constants.ERROR_TYPES.DATA_NOT_FOUND);
    }
    
    const pass=compareHash(password,user.password)
    if (!pass) {
        throw createErrorResponse(WRONG_PASSWORD,constants.ERROR_TYPES.UNAUTHORIZED);
    }

    const token = generateToken(user._id);

    return createSuccessResponse(LOGGED_IN_SUCESSFULLY, {token:token});
};

userControllers.getProfile=async(payload)=>{
    const user = await modelServices.findOne(userModel, {
           _id: payload.user.userId, isDeleted: false
        },
        {
            name: 1, email: 1, gender: 1, role: 1
        });
    
    if (!user) {
        throw createErrorResponse(USER_DELETED, constants.ERROR_TYPES.BAD_REQUEST);
    }

    return createSuccessResponse(USER_FOUND,user)
}

userControllers.updateProfile=async(payload)=>{
    const data={ };

    if (payload.name) data.name = payload.name;
    if (payload.role) data.role = payload.role;
    if (payload.gender) data.gender = payload.gender;
   

    const user=await modelServices.findOneAndUpdate(userModel,{
        _id:payload.user.userId,isDeleted:false
    },{
        $set:data
    },{
        new:true
    })

    if(!user){
        throw createErrorResponse(USER_NOT_UPDATED,constants.ERROR_TYPES.BAD_REQUEST)
    }
    return createSuccessResponse(USER_UPDATED_SUCESSFULLY)
}

userControllers.deleteUser=async(payload)=>{
    const deletedUser=modelServices.findOneAndUpdate(userModel,{
        _id:payload.user.userId,isDeleted:false
    },{
        $set:{isDeleted:true}
    })

    if(!deletedUser){
        createErrorResponse(USER_NOT_DELETED,constants.ERROR_TYPES.BAD_REQUEST)
    }
    return createSuccessResponse(USER_DELETED)
}

module.exports=userControllers