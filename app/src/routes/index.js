const express = require('express');
const logger = require('../../winton');
const ctrl = require('./index.ctrl');
const {verifyAccessToken, accessTokenData} = require('../models/jwt');
const router = express.Router();

router.get('/index', (req, res) =>{
    res.render('index', { title: '아임포트', message: '정기결제 등록 테스트'});
  });
router.get('/getCustomerUid', verifyAccessToken, ctrl.output.CustomerUid);
router.post('/webhook', ctrl.postProcess.webhook);

router.get('/', verifyAccessToken, ctrl.output.index);
router.post('/refresh',accessTokenData, ctrl.postProcess.refresh);



router.get('/test', ctrl.postProcess.test);
module.exports = router;
