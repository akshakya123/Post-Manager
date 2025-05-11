const Joi = require('joi');
const path = require('path');
const { MESSAGES, ERROR_TYPES } = require('./constants');
const HELPERS = require('../helpers');
const utils = require('./utils');
const helpers = require('../helpers');
const { request } = require('http');
const { response } = require('express');
const { nextTick } = require('process');
const authService = require('../services/authServices');
const constants = require('./constants');
const { createErrorResponse } = require('../helpers/helpers');
const { SOMETHING_WENT_WRONG } = require('./messages');

const routeUtils = {};

routeUtils.route = async (app, routes = [],) => {
    routes.forEach((route) => {
        let middlewares = [];
        if (route.joiSchemaForSwagger?.formData) {
            const multerMiddleware = getMulterMiddleware(route.joiSchemaForSwagger.formData);
            middlewares = [multerMiddleware];
        }
        middlewares.push(getValidatorMiddleware(route));

        if (route.auth) {
            middlewares.push(authService.authenticateToken());
        }

        app.route(route.path)[route.method.toLowerCase()](...middlewares, getHandlerMethod(route));
    });
};


const checkJoiValidationError = (joiValidatedObject) => {
    if (joiValidatedObject.error) throw joiValidatedObject.error;
};

const joiValidatorMethod = async (request, route) => {
    if (route.joiSchemaForSwagger.params && Object.keys(route.joiSchemaForSwagger.params).length) {
        request.params = await Joi.object(route.joiSchemaForSwagger.params).validate(request.params);
        checkJoiValidationError(request.params);
    }
    if (route.joiSchemaForSwagger.body && Object.keys(route.joiSchemaForSwagger.body).length) {
        request.body = await Joi.object(route.joiSchemaForSwagger.body).validate(request.body);
        checkJoiValidationError(request.body);
    }
    if (route.joiSchemaForSwagger.query && Object.keys(route.joiSchemaForSwagger.query).length) {
        request.query = await Joi.object(route.joiSchemaForSwagger.query).validate(request.query);
        checkJoiValidationError(request.query);
    }
    if (route.joiSchemaForSwagger.headers && Object.keys(route.joiSchemaForSwagger.headers).length) {
        const headersObject = await Joi.object(route.joiSchemaForSwagger.headers).unknown(true).validate(request.headers);
        checkJoiValidationError(headersObject);
        request.headers.authorization = ((headersObject || {}).value || {}).authorization;
    }
    if (route.joiSchemaForSwagger.formData
        && route.joiSchemaForSwagger.formData.body
        && Object.keys(route.joiSchemaForSwagger.formData.body).length) {
        multiPartObjectParse(route.joiSchemaForSwagger.formData.body, request);
        request.body = await Joi.object(route.joiSchemaForSwagger.formData.body).validate(request.body);
        checkJoiValidationError(request.body);
    }
};


let multiPartObjectParse = (formBody, request) => {
    let invalidKey;
    try {
        Object.keys(formBody)
            .filter((key) => ['object', 'array'].includes(formBody[key].type))
            .forEach((objKey) => {
                invalidKey = objKey;
                if (typeof request.body[objKey] === 'string') request.body[objKey] = JSON.parse(request.body[objKey]);
            });
    } catch (err) {
        throw new Error(`${invalidKey} must be of type object`);
    }
};


let getValidatorMiddleware = (route) => (request, response, next) => {
    joiValidatorMethod(request, route).then(() => next()).catch((err) => {
        const error = err;
        const responseObject =createErrorResponse(error, constants.ERROR_TYPES.BAD_REQUEST);
        return response.status(responseObject.statusCode).json(responseObject);
    });
};


let getHandlerMethod = (route) => {
    const { handler } = route;
    return (request, response) => {
        let payload = {
            ...((request.body || {}).value || {}),
            ...((request.params || {}).value || {}),
            ...((request.query || {}).value || {}),
            user: (request.user ? request.user : {}),
        };
        if (route.getExactRequest) {
            request.payload = payload;
            payload = request;
        }
        handler(payload)
            .then((result) => {
                if (result?.filePath) {
                    const filePath = path.resolve(`${__dirname}/../${result.filePath}`);
                    return response.status(result.statusCode).sendFile(filePath);
                }
                if (result.fileData) {
                    response.attachment(result.fileName);
                    response.send(result.fileData.Body);
                    return response;
                }
                if (result.redirectUrl) {
                    return response.redirect(result.redirectUrl);
                }
                if (result.statusCode) {
                    response.status(result.statusCode).json(result);
                } else {
                    response.json(result);
                }
            })
            .catch((err) => {
                console.log('Error is ', err);
                request.body.error = {};
                request.body.error.message = err.message;
                if (!err.statusCode && !err.status) {
                    err = createErrorResponse(SOMETHING_WENT_WRONG, constants.ERROR_TYPES.INTERNAL_SERVER_ERROR);
                }
                response.status(err.statusCode).json(err);
            });
    };
};


module.exports = routeUtils;
