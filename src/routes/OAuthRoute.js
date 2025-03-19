const express = require('express');
const OAuthController = require('../controllers/OAuthController')
const commonService = require('../services/commonService');

const router = express.Router();

router.get('/googleLogin', OAuthController.OAuthGoogleLogin)
router.get('/google/callback', OAuthController.OAuthGoogleCallBack)

//testing url 
router.get('/dashboard', commonService.verifyToken, OAuthController.Dashboard)

module.exports = router;