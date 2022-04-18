/**
 * @api {post} /user/login 로그인
 *
 * @apiDescription   사용자 로그인
 *
 * @apiVersion        1.0.0
 * @apiName           user-login
 * @apiGroup          user
 *
 * @apiBody {String} user_mobile 전화번호
 * @apiBody {String} user_psword 비밀번호
 *
 * @apiSampleRequest  /user/login
 *
 * @apiExample {curl} Example usage:
 *     curl  --header "Content-Type: application/json"
 *           --request POST 
 *           --data '{"user_mobile":"01075293575", "user_psword": "12345678"}' 
 *           http://api.bogyu98.shop/user/login
 *
 * @apiSuccess {boolean} success true
 * @apiSuccess {String} message 결과 메시지
 * @apiSuccess {String[]} response 결과 데이터
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "success": true,
 *        "response":{
 *            token : "string",
 *            user_no : "string",
 *            user_mobile : "string",
 *            user_code : "string"
 *          }
 *      }
 *
 * @apiSuccess {boolean} success false
 * @apiError {String} err 에러 메시지
 *
 */