const { createSuccessResponse, createErrorResponse } = require("../helpers/helpers");
const { userModel, adminModel } = require("../models");
const { generateToken } = require("../services/authServices");
const modelServices = require("../services/modelServices");
const constants = require("../utils/constants");
const { WRONG_PASSWORD, LOGGED_IN_SUCESSFULLY, USER_FOUND, USER_NOT_UPDATED, USER_UPDATED_SUCESSFULLY, USER_NOT_FOUND } = require("../utils/messages");
const { hashPassword, compareHash } = require("../utils/utils");


let adminControllers={};

adminControllers.adminlogin=async(payload)=>{
    const{email,password}=payload;

    const admin=await modelServices.findOne(adminModel,{email:email})
    
    if(!admin){
        const myPassword=hashPassword('admin@1234')
        await modelServices.insertUser(adminModel,{
            name:"Admin",
            email:"admin123@gmail.com",
            password:myPassword
        })
    }

    const comparePass=compareHash(password,admin.password)

    if(!comparePass){
        throw createErrorResponse(WRONG_PASSWORD,constants.ERROR_TYPES.UNAUTHORIZED)
    }

    const token=generateToken(admin._id);

    return createSuccessResponse(LOGGED_IN_SUCESSFULLY,{token:token})
}

adminControllers.getUsers=async(payload)=>{
    const {start,count} = payload;

    const users=await modelServices.aggregate(userModel,[
        {$skip:start},
        {$limit:count},
        {$project:{name:1,email:1}}
    ])

    return createSuccessResponse(USER_FOUND,users);
}

adminControllers.getProfile=async(payload)=>{

    const admin=await modelServices.findOne(adminModel,{_id:payload.user.id},{name:1,email:1,role:1})

    if(!admin){
        throw createErrorResponse(USER_NOT_FOUND,constants.ERROR_TYPES.DATA_NOT_FOUND)
    }

    return createSuccessResponse(USER_FOUND,admin);
}

adminControllers.updatePass=async(payload)=>{
    const {password,newPassword}=payload;

    const admin=await modelServices.findOne(adminModel,{
        _id:payload.user.id
    })

    const comparePass=compareHash(password,admin.password);

    if(!comparePass){
        throw createErrorResponse(WRONG_PASSWORD,constants.ERROR_TYPES.UNAUTHORIZED)
    }

    const newHashedPass=hashPassword(newPassword)

    const adminSetPass=await modelServices.findOneAndUpdate({
        _id:payload.user.id
    },{
        $set:{password:newHashedPass}
    })

    if(!adminSetPass){
        throw createErrorResponse(USER_NOT_UPDATED,constants.ERROR_TYPES.BAD_REQUEST)
    }

    return createSuccessResponse(USER_UPDATED_SUCESSFULLY)

}

module.exports=adminControllers;
