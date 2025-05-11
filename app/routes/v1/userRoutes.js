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
                email: Joi.string().email().required()
            }
        },
        role:constants.ROLES.USER,
        handler: userControllers.register
    },
    {
        method: 'POST',
        path: '/v1/user/verification',
        joiSchemaForSwagger: {
            group: 'user',
            description: 'Verify email',
            body: {
                email: Joi.string().email().required(),
                otp: Joi.string().required(),
            }
        },
        auth: constants.AUTHS.USER,
        role:constants.ROLES.USER,
        handler: userControllers.verifyEmail
    },
    {
        method: 'POST',
        path: '/v1/user/addDetails',
        joiSchemaForSwagger: {
            group: 'user',
            description: 'User Details',
            body: {
                name: Joi.string().required(),
                gender: Joi.string().required(),
                password:Joi.string().required()
            }
        },
        auth: constants.AUTHS.USER,
        role:constants.ROLES.USER,
        handler: userControllers.addDetails
    },
    {
        method: 'PUT',
        path: '/v1/user/update',
        joiSchemaForSwagger: {
            group: 'user',
            description: 'Update User',
            body: {
                email: Joi.string().email().required(),
                password: Joi.string().min(8).required() 
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
                password: Joi.string().min(8).required() 
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
        },
        auth: constants.AUTHS.USER,
        role:constants.ROLES.USER,
        handler: userControllers.deleteUser
    },
    {
        method: 'POST',
        path: '/v1/user/forgotPassword',
        joiSchemaForSwagger: {
            group: 'user',
            description: 'Forgot Password',
            body: {
                email: Joi.string().email().required(),
            }
        },
        // role:constants.ROLES.USER,
        handler: userControllers.forgotPassword
    },
    {
        method: 'POST',
        path: '/v1/user/newPassword',
        joiSchemaForSwagger: {
            group: 'user',
            description: 'Set new Password',
            body: {
                email: Joi.string().email().required(),
                otp: Joi.any().required() ,
                newPassword:Joi.string().min(8).required()
            }
        },
        auth: constants.AUTHS.USER,
        role:constants.ROLES.USER,
        handler: userControllers.newPassword
    },
    {
        method: 'POST',
        path: '/v1/user/resetPassword',
        joiSchemaForSwagger: {
            group: 'user',
            description: 'Reset User Password',
            body: {
                oldPassword:Joi.string().required(),
                newPassword:Joi.string().min(8).required()
            }
        },
        auth: constants.AUTHS.USER,
        role:constants.ROLES.USER,
        handler: userControllers.resetPassword
    },
];

routeUtils.route(userRouter, userRoutes);

module.exports = userRouter;
