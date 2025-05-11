const Joi=require('joi');
const express=require('express')
const constants = require('../../utils/constants');
const adminControllers = require('../../controllers/adminControllers');
const routeUtils = require('../../utils/routeUtils');
const adminRouter=express.Router()

const adminRoutes=[
    {
        method:'POST',
        path:'/v1/admin/login',
        joiSchemaForSwagger:{
            group:'admin',
            description:'Admin login',
            body:{
                email:Joi.string().email().required(),
                password:Joi.string().min(8).required()
            }
        },
        handler:adminControllers.adminlogin
    },
    {
        method:'GET',
        path:'/v1/admin/data',
        joiSchemaForSwagger:{
            group:'admin',
            description:'Admin profile details',
        },
        auth:constants.AUTHS.ADMIN,
        role:constants.ROLES.ADMIN,
        handler:adminControllers.getProfile
    },
    {
        method:'PUT',
        path:'/v1/admin/update',
        joiSchemaForSwagger:{
            group:'admin',
            description:'Admin profile update',
            body:{
                email:Joi.string().email().optional(),
                password:Joi.string().min(8).optional()
            }
        },
        auth:constants.AUTHS.ADMIN,
        role:constants.ROLES.ADMIN,
        handler:adminControllers.updatePass
    },
    {
        method:'GET',
        path:'/v1/admin/users',
        joiSchemaForSwagger:{
            group:'admin',
            description:'View Users',
            query:{
                start:Joi.number().min(0).required(),
                count:Joi.number().min(1).max(20).required()
            },
            body:{
                email:Joi.string().email().optional(),
                password:Joi.string().min(8).optional()
            }
        },
        auth:constants.AUTHS.ADMIN,
        role:constants.ROLES.ADMIN,
        handler:adminControllers.getUsers
    }
]

routeUtils.route(adminRouter, adminRoutes);

module.exports=adminRouter
