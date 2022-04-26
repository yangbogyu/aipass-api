const express = require('express');
const logger = require('../../winton');
const ctrl = require('./index.ctrl');
const {jwt, verifyAccessToken} = require('../models/jwt');
const jwtKen = require('jsonwebtoken');
const router = express.Router();
 

router.get('/', verifyAccessToken, ctrl.output.index);
router.post('/refresh', ctrl.postProcess.refresh);
module.exports = router;
