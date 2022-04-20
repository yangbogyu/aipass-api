const express = require('express');
const ctrl = require('./user.ctrl');
const router = express.Router();

router.post('/register', ctrl.process.register);
router.post('/login', ctrl.process.login);
router.put('/update', ctrl.process.update);

module.exports = router;
