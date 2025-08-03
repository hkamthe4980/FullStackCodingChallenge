const express = require('express');
const router = express.Router();
const {
  addStore,
  getStores,
  getStoreById
} = require('../controllers/store.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, addStore);
router.get('/', verifyToken, getStores);
router.get('/:id', verifyToken, getStoreById);

module.exports = router;
