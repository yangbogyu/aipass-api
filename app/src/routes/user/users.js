const express = require('express');
const ctrl = require('./user.ctrl');
const {jwt, verifyAccessToken} = require('../../models/jwt');
const router = express.Router();

router.get('/login', verifyAccessToken, ctrl.output.login);

router.post('/register', ctrl.postProcess.register);
router.post('/login', ctrl.postProcess.login);
router.put('/update',verifyAccessToken, ctrl.putProcess.update);
router.delete('/delete', verifyAccessToken,ctrl.deleteProcess.delete);

module.exports = router;
