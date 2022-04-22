const express = require('express');
const ctrl = require('./user.ctrl');
const router = express.Router();

router.post('/register', ctrl.postProcess.register);
router.post('/login', ctrl.postProcess.login);
router.put('/update', ctrl.putProcess.update);
router.delete('/delete', ctrl.deleteProcess.delete);

module.exports = router;
