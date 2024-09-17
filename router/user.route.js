const express = require('express');
const { register, login, logout } = require('../controllers/user.auth.controller');
const veryfiToken = require('../middleware/veryfiToken');
const { userDelete, allUser, updateRole, userProfileUpdate } = require('../controllers/user.controller');

const router = express.Router();
// auth user
router.post('/register', register)
router.post('/login', login )
router.post('/logout', logout )

// user 
router.delete('/users/:id' , userDelete)
router.get('/users' , allUser)
router.put('/users/:id', updateRole)
router.patch('/edit-profile', userProfileUpdate)


module.exports = router