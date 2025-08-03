const express = require('express');
const router = express.Router();
const {
  submitRating,
  getRatingsByStore,
  getRatingsByUser
} = require('../controllers/rating.controller');

const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, submitRating); // Normal user
router.get('/store/:storeId', verifyToken, getRatingsByStore); // Store owner
router.get('/user/:userId', verifyToken, getRatingsByUser);    // Normal user

module.exports = router;
