const express = require('express');
const ctrl = require('./apt.ctrl');
const {jwt, verifyAccessToken} = require('../../models/jwt');
const router = express.Router();

router.get('/:apt_name', verifyAccessToken, ctrl.output.apt);


module.exports = router;
