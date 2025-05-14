const express = require('express');
const cors = require('cors');
const {userRouter, userRoutes} = require('../routes/v1/userRoutes');
const routeUtils = require('../utils/routeUtils');
const { adminRouter, adminRoutes } = require('../routes/v1/adminRoutes');

module.exports = async (app, isSwaggerWrite) => {
    app.use(cors());
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));

    app.use('/user', userRouter);
    app.use('/admin',adminRouter)

    await routeUtils.route(app,userRoutes,isSwaggerWrite)
    await routeUtils.route(app,adminRoutes,isSwaggerWrite)
};
