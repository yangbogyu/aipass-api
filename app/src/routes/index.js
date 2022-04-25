const express = require('express');
const logger = require('../../winton');
const ctrl = require('./index.ctrl');
const jwt = require('../models/jwt');
const jwtKen = require('jsonwebtoken');
const router = express.Router();
 
const verifyAccessToken = (req, res, next) =>{
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken) {
      return res.status(401).json({success: false ,err: "accessToken이 없거나 형식이 잘못되었습니다."});
  }

  jwtKen.verify(accessToken, process.env.SECRET_KEY, (error, user) => {
      if (error){ 
          if(error.name === 'TokenExpiredError')
              return res.status(403).json({success: false, err: 'accessToken 만료.'});
          else
              return res.status(403).json({success: false, err: `${error}`});
      }
      req.data=user;
      req.data.status=200;
      next();
  });
};
router.get('/', verifyAccessToken, ctrl.output.index);
router.post('/refresh', ctrl.postProcess.refresh);
module.exports = router;
