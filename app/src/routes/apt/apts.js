const express = require('express');
const ctrl = require('./apt.ctrl');
const {jwt, verifyAccessToken} = require('../../models/jwt');
const router = express.Router();

router.get('/:apt_name', verifyAccessToken, ctrl.output.apt);
router.get('/bldg/:apt_no', verifyAccessToken, ctrl.output.bldg);
router.get('/home/:bldg_no', verifyAccessToken, ctrl.output.home);

module.exports = router;
