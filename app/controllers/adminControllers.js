//User Management By Admin
/* 
   Admin

   GET /api/v1/admin/users — List all users

   GET /api/v1/admin/users/:id — Get single user details

   PUT /api/v1/admin/users/:id — Update user role/profile

   DELETE /api/v1/admin/users/:id — Delete user
*/

const { createSuccessResponse, createErrorResponse } = require("../helpers/helpers");
const { userModel} = require("../models");
const modelServices = require("../services/modelServices");
const constants = require("../utils/constants");
const {USER_FOUND,  USER_NOT_FOUND, USER_UPDATED_SUCESSFULLY, USER_NOT_UPDATED } = require("../utils/messages");


let adminControllers={};

adminControllers.getUsers = async (payload) => {
    
    const {page,limit} = payload;

    const skipUser = (Number(page) - 1) * Number(limit);
    
    const users=await modelServices.aggregate(userModel,[
        {$match:{}},
        {$skip:Number(skipUser)},
        {$limit:Number(limit)},
        {$project:{name:1,email:1,role:1,gender:1,phone:1,isDeleted:1}}
    ])

    return createSuccessResponse(USER_FOUND,users);
}

adminControllers.getProfile = async (payload) => {

    console.log(payload);

    const admin=await modelServices.findOne(userModel,{_id:payload.id},{name:1,email:1,role:1,gender:1,phone:1,isDeleted:1})

    if(!admin){
        throw createErrorResponse(USER_NOT_FOUND,constants.ERROR_TYPES.DATA_NOT_FOUND)
    }

    return createSuccessResponse(USER_FOUND,admin);
}

adminControllers.updateProfile=async (payload) => {
    const data = {};
    if (payload.name) data.name = payload.name;
    if (payload.role) data.role = payload.role;
    if (payload.phone) data.phone = payload.phone;

    const user=await modelServices.findOneAndUpdate(userModel, { _id: payload.id }, {data}, { upsert: false });
    console.log(user);
    if (!user) {
        throw createErrorResponse(USER_NOT_UPDATED, constants.ERROR_TYPES.BAD_REQUEST)
    }
    return createSuccessResponse(USER_UPDATED_SUCESSFULLY);
}

module.exports=adminControllers;
