const express = require('express');
const cors = require('cors');
const adminRouter = require('../routes/v1/adminRoutes');
const userRouter = require('../routes/v1/userRoutes');

module.exports = async (app) => {
    app.use(cors());
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));

    app.use('/user', userRouter);
    app.use('/admin', adminRouter);
};
