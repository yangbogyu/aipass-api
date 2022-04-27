/**
 * @api {post} /user/login 로그인
 *
 * @apiDescription   사용자 로그인(id/psword)
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
 *           https://bogyu.shop/user/login
 *
 * @apiSuccess {boolean} success true
 * @apiSuccess {String[]} data 결과 데이터
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "success": true,
 *        "data": {
 *              "user_no": "String",
 *              "user_mobile": "String",
 *              "user_code": "String",
 *              "user_name": "String",
 *              "token": {
 *                  "accessToken": "token",
 *                  "refershToken": "token"
 *              }
 *          }
 *      }
 *
 * @apiError {boolean} success false
 * @apiError {String} err 에러 메시지
 *
 */

/**
 * @api {get} /user/login 로그인(token)
 *
 * @apiDescription   사용자 로그인(token)
 *
 * @apiVersion        1.0.0
 * @apiName           user-login-token
 * @apiGroup          user
 *
 * @apiHeader {String} Authorization access_token
 * @apiHeaderExample {Header} Header-Example
 *     "Authorization: Bearer 5f048fe"
 * 
 * @apiSampleRequest  /user/login
 *
 * @apiExample {curl} Example usage:
 *   curl  --header "Content-Type: application/json"
 *         --request GET
 *       https://bogyu.shop/user/login
 *
 * 
 * @apiSuccess {boolean} success true
 * @apiSuccess {String[]} data 결과 데이터
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "success": true,
 *        "data": {
 *              "user_no": "String",
 *              "user_mobile": "String",
 *              "user_code": "String",
 *              "user_name": "String"
 *          }
 *      }
 *
 * @apiError {boolean} success false
 * @apiError {String} err 에러 메시지
 *
 */