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

router.post('/update',verifyAccessToken, ctrl.postProcess.update);

router.delete('/delete', verifyAccessToken,ctrl.deleteProcess.delete);

router.post('/home-register', verifyAccessToken, ctrl.postProcess.homeRegister);
router.delete('/home-delete', verifyAccessToken,ctrl.deleteProcess.homeDelete);

router.get('/billing', ctrl.output.billing);
router.delete('/billing', verifyAccessToken, ctrl.deleteProcess.billing);

router.get('/customer-uid', verifyAccessToken, ctrl.output.CustomerUid);
router.get('/customer-uid/:apc_no', verifyAccessToken, ctrl.output.CustomerUid);

module.exports = router;

