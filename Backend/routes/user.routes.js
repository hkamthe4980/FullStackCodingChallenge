const express = require('express');
const router = express.Router();
const {
  addUser,
  getUsers,
  getUserById,
  updateUser
} = require('../controllers/user.controller');
const { updatePassword } = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');




// router.post('/', addUser);         // Only admin allowed (add role check)
// router.get('/', getUsers);
// router.get('/:id', getUserById);
// router.put('/:id', updateUser);
router.post('/', verifyToken, addUser);         // Only admin allowed (add role check)
router.get('/', verifyToken, getUsers);
router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, updateUser);
router.put('/password/:id', verifyToken, updatePassword); // User can update own password

module.exports = router;
