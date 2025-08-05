const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/owner.controller');
const { verifyToken , isStoreOwner} = require('../middlewares/auth.middleware');



router.get('/dashboard', verifyToken, isStoreOwner, getOwnerDashboard);

module.exports = router;
