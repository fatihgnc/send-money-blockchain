const router = require('express').Router();
const { createUser, logUserIn, logUserOut } = require('./user.service');

router.post('/register', createUser);
router.post('/login', logUserIn);
router.post('/logout', logUserOut);

module.exports = router;
