const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require('../config/env');
const user = require('../models/user');
const commonService = require('../services/commonService');
const mongoose = require('mongoose');

exports.register = async (req, res) => {
    try {
        const { name, email, password, userRole } = req.body;
        if(!password) return res.status(403).send({ status: false , message: `Password is required`})
        const hashedPassword = await bcrypt.hash(password, 10);

        const userDetails = new user({ name, email, password: hashedPassword, userRole, isApproved: userRole === 1 ? true : false });
        await userDetails.save();
        res.status(201).json({ message: "User Registered Successfully" });
    } catch(error) {
        res.status(500).json({ Error: error });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const getUser = await user.findOne({ email });

        if(!getUser){
            return res.status(403).json({ status: false, message: "User details not found"});
        }

        if(!getUser.isApproved) {
            return res.status(403).json({ status: false, message: "Your account is not approved by Admin" });
        }
        
        const isMatch = await bcrypt.compare(password, getUser.password);
        if(!isMatch) {
            return res.status(400).json({ status: false, message: "Invalid credentials" });
        }

        const token = await commonService.jwtTokenGeneration(getUser);
        
        return res.status(201).json({ status: true, message: "User loggined successfully", token });

    } catch(error) {
        return res.status(500).json({ status: false, error: error.message });
    }
}

exports.sendOtp = async (req, res) => {
    try{
        let { email } = req.body;
        let userInfo = await user.findOne({ email });

        if(!userInfo) {
            return res.status(400).json({ status: false, message: "User emailaddress not found"});
        }

        let otp = await commonService.generateOtp();

        await user.updateOne({ _id: userInfo._id }, 
            { $set: { Otp: otp }}).exec();
        
        const sendEmail = await commonService.sendMail({email, otp, subject: 'Your OTP Code'});

        if(!sendEmail) {
            return res.status(400).json({ status: false, message: "Mail does not sent" });
        }

        return res.status(200).json({ status: true, message: "Otp sent successfully" });
    } catch(error) {
        return res.status(500).json({ status: false, message: error });
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const userInfo = await user.findOne({ email });
        console.log("user", userInfo);
        

        if(!userInfo) {
            return res.status(400).json({ status: false, message: "User not found" });
        }
        
        if(userInfo.Otp === otp) {
            await user.updateOne({ _id: userInfo._id },
                { $set: {Otp: null } });

            const token = await commonService.jwtTokenGeneration(userInfo);
            return res.status(201).json({ status: true, message: "User loggined successfully", token });
        } else {
            return res.status(400).json({ status: false, message: "Please enter a valid otp" });
        }

    } catch(error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.updatePassword = async (req, res) => {
    try {
        let { email, password } = req.body;
        let userInfo = await user.findOne({ email });

        const hashedPassword = await bcrypt.hash(password, 10);

        if(!userInfo) {
            return res.status(400).json({ status: false, message: "User not found" });
        }

        if(userInfo.isApproved === false) {
            return res.status(400).json({ status: false, message: "User cannot approved by admin" });
        }

        await user.updateOne({ _id: userInfo._id },
            {$set: {password: hashedPassword}}
        );

        return res.status(200).json({ status: true, message: "Password updated successfully" });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const userInfo = await user.findOne({ email });
        console.log("userInfo", userInfo);
        

        if(!userInfo) {
            return res.status(400).json({ status: false, message: "User details not found" });
        }

        const resetToken = await jwt.sign({ _id: userInfo._id }, dotenv.jwtSecret, { expiresIn: "15m" });

        const otp = await commonService.generateOtp();
        
        const updateUser = await user.updateOne({ _id: new mongoose.Types.ObjectId(userInfo._id)}, 
            { $set: { Otp: otp }}
        );

        const resetLink = `http://localhost:3000/reset?token=${resetToken}`;
        const sendMail = await commonService.sendMail({email, otp, subject: 'Forgot password verification'});

        return res.status(200).json({ status: true, message: "Reset link sent to email", resetToken });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

exports.resetPassword = async (req, res) => {
     try {
        const { newPassword } = req.body;
        const token = req.headers["authorization"];
        const decoded = jwt.verify(token.split(' ')[1], dotenv.jwtSecret);
        console.log("decoded", decoded);
        


        const userInfo = await user.findById(decoded._id);
        if(!userInfo) {
            return res.status(400).json({ status: false, message: "Invalid token or user not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updateUserInfo = await user.updateOne({ _id: userInfo._id }, 
            { $set: {password: hashedPassword }}
        );

        return res.status(200).json({ status: true, message: "Password reset successfully" });

     } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
     }
}

 