const express = require('express');
const userManagementController = require('../controllers/userManagementController');
const commonService = require('../services/commonService');

const router = express.Router();

router.post('/approveUser/:id', userManagementController.approveUser);
router.post('/rejectUser/:id', userManagementController.rejectUser);
router.post('/adminCreateUser', userManagementController.adminCreateUser);
router.get('/getUserList', userManagementController.getUserList);

module.exports = router;