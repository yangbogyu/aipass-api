const express = require('express');
const router = express.Router();
 
/**
* @swagger
* paths:
*  /:
*   get:
*     tags: /
*     summary: 기본 페이지
*     responses:
*       "200":
*         description: 로그인 페이지 로드 성공
*   post:
*     tags: [SignIn]
*     summary: 로그인 로직 처리
*     parameters:
*       - name: code
*         in: Post
*         type: string
*         description: 로그인 정보(아이디)
*     responses:
*       "200":
*         discription: 로그인 성공
*         contnet:
*           application:json
*       "400":
*         discription: 잘못된 파라메타 전달
*     
*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
