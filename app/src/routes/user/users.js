const express = require('express');
const ctrl = require('./user.ctrl');
const {jwt, verifyAccessToken} = require('../../models/jwt');
const router = express.Router();

router.get('/login', verifyAccessToken, ctrl.output.login);


//메인화면 데이터
router.get('/apt-info', verifyAccessToken, ctrl.output.apt);
router.get('/scan-info', verifyAccessToken, ctrl.output.scan);
router.get('/advertise-info', verifyAccessToken, ctrl.output.advertise);

router.post('/register', ctrl.postProcess.register);
router.post('/login', ctrl.postProcess.login);

router.put('/update',verifyAccessToken, ctrl.putProcess.update);

router.delete('/delete', verifyAccessToken,ctrl.deleteProcess.delete);

router.post('/home-register', ctrl.postProcess.homeRegister);

module.exports = router;

