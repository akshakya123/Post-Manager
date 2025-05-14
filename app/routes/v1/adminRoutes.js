const Joi=require('joi');
const express=require('express')
const constants = require('../../utils/constants');
const adminControllers = require('../../controllers/adminControllers');
const routeUtils = require('../../utils/routeUtils');
const adminRouter=express.Router()

const adminRoutes=[
    {
        method:'GET',
        path:'/v1/admin/users',
        joiSchemaForSwagger:{
            group:'admin',
            description:'View Users',
            headers:{
                authorization:Joi.string().required()
            },
            query:{
                page:Joi.number().integer().required(),
                limit:Joi.number().integer().max(20).required()
            }
        },
        auth: constants.AUTHS.ADMIN,
        roles: ['admin'],
        role:constants.ROLES.ADMIN,
        handler:adminControllers.getUsers
    },
    {
        method: 'GET',
        path: '/v1/admin/user/:id',
        joiSchemaForSwagger: {
            group: 'admin',
            description: 'View Spacefic User',
            headers: {
                authorization: Joi.string().required()
            },
            params: {
                id:Joi.string().required(),
            }
        },
        auth: constants.AUTHS.ADMIN,
        roles: ['admin'],
        role: constants.ROLES.ADMIN,
        handler: adminControllers.getProfile
    },
    {
        method: 'PUT',
        path: '/v1/admin/updateUser/:id',
        joiSchemaForSwagger: {
            group: 'admin',
            description: 'Update Spacefic User',
            headers: {
                authorization: Joi.string().required()
            },
            body: {
                name: Joi.string().optional(),
                role: Joi.string().optional(),
                phone: Joi.string().optional(),
            },
            params: {
                id: Joi.string().required(),
            }
        },
        auth: constants.AUTHS.ADMIN,
        roles: ['admin'],
        role: constants.ROLES.ADMIN,
        handler: adminControllers.updateProfile
    }
]

routeUtils.route(adminRouter, adminRoutes);

module.exports={adminRouter,adminRoutes};
