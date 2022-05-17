const express = require('express');
const logger = require('../../winton');
const ctrl = require('./index.ctrl');
const {verifyAccessToken, accessTokenData} = require('../models/jwt');
const router = express.Router();

router.get('/', verifyAccessToken, ctrl.output.index);
router.post('/refresh',accessTokenData, ctrl.postProcess.refresh);
module.exports = router;
