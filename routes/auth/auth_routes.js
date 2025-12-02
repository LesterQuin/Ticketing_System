const express = require('express');
const router = express.Router();
const { register, login } = require('../../controllers/auth/auth_Controller');

router.post('/register', register);
router.post('/login', login);

module.exports = router;
