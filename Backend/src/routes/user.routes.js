const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/user/profile/:userId', userController.getuser);

module.exports = router;
