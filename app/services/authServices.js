const { SECRET_KEY } = require("../../config/config");
const jwt=require('jsonwebtoken');
const { createErrorResponse } = require("../helpers/helpers");
const { MISSING_TOKEN, SOMETHING_WENT_WRONG } = require("../utils/messages");

let authService={};

authService.authenticateToken=()=>(request,response,next)=>{
    const authHeaders= request.headers['authorization'];

    if(!authHeaders){
        throw response.status(401).json({"Error":MISSING_TOKEN})
    }

    const token=authHeaders;

    jwt.verify(token,SECRET_KEY,(error,data)=>{
        if(error){
            throw response.status(400).json({"Error" : "Token invalid or expired"})
        }
        request.user = data;
        next();
    })
}

authService.generateToken = (id) => {
    return jwt.sign({ id }, SECRET_KEY, { expiresIn: '2h' });
}

authService.generateTokenforEmail=(email)=>{
    return jwt.sign({ email }, SECRET_KEY, { expiresIn: '2h' });
}

authService.generateTokenforOtp=(otp)=>{
    return jwt.sign({ otp }, SECRET_KEY, { expiresIn: '120s' });
}

module.exports = authService;