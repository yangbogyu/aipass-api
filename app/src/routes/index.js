const express = require('express');
const jwt = require('../models/jwt');
const router = express.Router();
 

router.get('/', jwt.checkToken, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
