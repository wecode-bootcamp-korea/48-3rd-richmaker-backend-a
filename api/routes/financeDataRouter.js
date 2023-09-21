const express = require('express');

const { financeDataController } = require('../controllers');
const { loginRequired } = require('../utils/auth');

const router = express.Router();
router.get('/reports', loginRequired, financeDataController.getDepositsExpenses);

module.exports = router;