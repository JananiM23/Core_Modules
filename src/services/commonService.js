const jwtToken = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('../config/env');


exports.jwtTokenGeneration = async (userDetaails) => {
    try {
         const token = jwtToken.sign(
            { _id: userDetaails._id, User_Role: userDetaails.User_Role }, 
            dotenv.jwtSecret, 
            { expiresIn: "30d" }
        );
        return token;     
    } catch (error) {
        return error;
    }
}

exports.sendMail = async (email, otp, subject) => {
    try {

        const otpTemplate = ` 
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 400px; margin: auto;">
                <h2 style="color: #333;">Your OTP Code</h2>
                <p style="font-size: 18px; color: #555;">Use the following OTP to complete your verification:</p>
                <h3 style="font-size: 24px; color: #007bff; margin: 10px 0;">${otp}</h3>
                <p style="font-size: 14px; color: #888;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
                <hr style="margin: 20px 0;">
                <p style="font-size: 12px; color: #aaa;">If you didn’t request this, please ignore this email.</p>
                </div>`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const sendMailInfo = transporter.sendMail({
            from: dotenv.email_user,
            to: 'jananimurugesan23@gmail.com',
            subject: subject,
            otpTemplate,
            text: 'SecureAuthApi Testing'
        });

        return sendMailInfo;
    } catch (error) {
        return error;
    }
}

exports.generateOtp = async (req, res) => {
    try {
        const oneTimeOtp = Math.floor(1000 + Math.random() * 9000).toString();
        return oneTimeOtp;
    } catch(error) {
        return error;
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const token = req.headers["authorization"];
        if(!token) {
            return res.status(401).json({ status: false, message: "Access denied. No token provided" });
        }

        let jwtAuthToken = token.split(' ')[1];

        const verifiedToken = jwtToken.verify(jwtAuthToken, dotenv.jwtSecret);
        req.user = verifiedToken;
        next();
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.verifyToken = async (req, res, next) => {
        const token = req.headers['authorization'];

        if(!token) {
            return res.status(403).json({ status: false, message: 'Access denied, no token provided' });
        }

        try {
            const decoded = jwtToken.verify(token.split(' ')[1], dotenv.jwtSecret);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(500).json({ status: false, message: 'Invalid or expired token' });
        }
}

