const Joi = require('joi');
const express = require('express');
const constants = require('../../utils/constants');
const userControllers = require('../../controllers/userControllers');
const routeUtils = require('../../utils/routeUtils'); 

const userRouter = express.Router();

const userRoutes = [
    {
        method: 'POST',
        path: '/v1/user/register',
        joiSchemaForSwagger: {
            group: 'user',
            description: 'User registration',
            body: {
                name:Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required(),
                role: Joi.string().valid('employer', 'jobseeker').required(),
                gender: Joi.string().valid('male', 'female', 'other'),
                phone:Joi.string().required(),
            }
        },
        role:constants.ROLES.USER,
        handler: userControllers.register
    },
    {
        method: 'PUT',
        path: '/v1/user/update',
        joiSchemaForSwagger: {
            group: 'user',
            description: 'Update User',
            headers:{
                authorization:Joi.string().required()
            },
            body: {
                name:Joi.string().optional(),
                gender: Joi.string().optional(),
                role: Joi.string().optional(),
                phone: Joi.string().optional(),
            }
        },
        auth: constants.AUTHS.USER,
        role:constants.ROLES.USER,
        handler: userControllers.updateProfile 
    },
    {
        method: 'POST',
        path: '/v1/user/login',
        joiSchemaForSwagger: {
            group: 'user',
            description: 'User login',
            body: {
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required() 
            }
        },
        role:constants.ROLES.USER,
        handler: userControllers.login
    },
    {
        method: 'GET',
        path: '/v1/user/data',
        joiSchemaForSwagger: {
            group: 'user',
            description: 'User profile details',
            headers:{
                authorization:Joi.string().required()
            }
        },
        auth: constants.AUTHS.USER,
        role:constants.ROLES.USER,
        handler: userControllers.getProfile
    },
    {
        method: 'DELETE',
        path: '/v1/user/delete',
        joiSchemaForSwagger: {
            group: 'user',
            description: 'Delete User',
            headers:{
                authorization:Joi.string().required()
            }
        },
        auth: constants.AUTHS.USER,
        role:constants.ROLES.USER,
        handler: userControllers.deleteUser
    },
];

routeUtils.route(userRouter, userRoutes);


module.exports = {userRouter,userRoutes};
