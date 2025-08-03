const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getStoreOwnerDashboard
} = require('../controllers/dashboard.controller');

const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/admin', verifyToken, getAdminDashboard);
router.get('/store', verifyToken, getStoreOwnerDashboard);

module.exports = router;
