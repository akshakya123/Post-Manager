const fs = require('fs');
const bcrypt=require('bcrypt')
const JWT = require('jsonwebtoken');
const { SALT } = require('../../config/config');
const nodemailer=require('nodemailer')

const commonFunctions = {};

commonFunctions.sendMailToVerify = async (email, otp) => {
    try {
        console.log(" Email Received:", email);

        if (!email) {
            throw new Error("Email not defined");
        }

        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            auth: {
                user: "88c5ad001@smtp-brevo.com",
                pass: "jgrkfTXb8xARSDWa",
            },
        });

        const mailOptions = {
            from: '<abhishekhkumarshakya@gmail.com>',
            to: email, 
            subject: "Email OTP Verification",
            html: `<p>Your OTP for email verification is: <b>${otp}</b></p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent successfully to ${email}`);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

commonFunctions.sendMailToChangePassword = async (email, otp) => {
    try {
        console.log(" Email Received:", email);

        if (!email) {
            throw new Error("Email not defined");
        }

        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            auth: {
                //fill user and pass credentials
            },
        });

        const mailOptions = {
            from: '<>',
            to: email, 
            subject: "Forgot Password Email",
            html: `<p>Your OTP for cahnging password is: <b>${otp}</b></p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent successfully to ${email}`);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};


commonFunctions.hashPassword = (payloadString) => bcrypt.hashSync(payloadString,SALT);

commonFunctions.compareHash = (payloadPassword, userPassword) => bcrypt.compareSync(payloadPassword, userPassword);

commonFunctions.generateOTP = () => {
    const otp=Math.random()*10000;
    return parseInt(otp);
};

module.exports = commonFunctions;
