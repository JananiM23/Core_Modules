const express = require('express');
const userManagementController = require('../controllers/userManagementController');
const commonService = require('../services/commonService');

const router = express.Router();

router.post('/approveUser', userManagementController.approveUser);
router.post('/rejectUser', userManagementController.rejectUser);
router.post('/adminCreateUser', userManagementController.adminCreateUser);
router.get('/getUserList', commonService.verifyToken, userManagementController.getUserList);

module.exports = router;