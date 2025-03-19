const user = require('../models/user');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.approveUser = async (req, res) => {
    try {
        const { id } = req.params;
        const recordId = mongoose.Types.ObjectId(id);
        console.log("record id", recordId);
        const updateUser = await User.updateOne({_id: recordId}, { $set: { isApproved: true }});
        if(!updateUser){
            return res.status(400).json({ status: false, message: "User not approved" });
        }
        return res.status(200).json({ status: true, message: "User approved successfully" });
    } catch(error) {
        return res.status(500).json({ status: false, Error: error })
    }
}

exports.rejectUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateUser = await User.updateOne({_id: id}, {$set: { isApproved: false }});
        if(!updateUser) {
            return res.status(400).json({ status: false, message: "User rejection failed" });
        }
        return res.status(200).json({ status: true, message: "User rejected successfully" });
    } catch(error) {
        return res.status(500).json({ status: false, Error: error });
    }
}

exports.adminCreateUser = async (req, res) => {
    try {
        const { email, name, password, role, isApproved } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const createUser = new User({ name, email, password: hashedPassword, role, isApproved });
        if(!createUser) {
            return res.status(400).json({status: false, message: "User creation failed" });
        }

        return res.status(200).json({ status: true, message: "User created successfully" });
    } catch(error) {
        return res.status(500).json({ status: false, Error: error });
    }
}

exports.getUserList = async (req, res) => {
    try {
        const { id } = req.body;
        const isAdmin = await User.findOne({ _id: id });

        if(isAdmin.userRole !== 1) {
            return res.status(403).json({ status: false, message: "Access denied, admin only able to acces this page" });
        }

        const allUserList = await User.find();

        return res.status(200).json({ status: true, message: "User listed successfully", allUserList });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}