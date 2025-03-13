const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/sendOtp", authController.sendOtp);
router.post("/verifyOtp", authController.verifyOtp);
router.post("/updatePassword", authController.updatePassword);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword", authController.resetPassword);

module.exports = router;