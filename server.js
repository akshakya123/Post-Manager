const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { PORT } = require('./config/config');

const app = express();

const startServer = async () => {
    await require('./app/startup/expressStartup')(app);

    return new Promise((res, rej) => {
        app.listen(PORT, (err) => {
            if (err) return rej(err);
            res();
        });
    });
};

startServer()
    .then(() => {
        console.log(`Server running on http://localhost:${PORT}`);
    })
    .catch((err) => {
        console.error(`Error starting server: ${err}`);
    });
