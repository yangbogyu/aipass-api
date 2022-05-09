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
 * @apiBody {String} unique_id 기기 아이디
 * @apiBody {String} push_token 푸시 토큰
 * @apiBody {String} model 핸드폰 기종
 * @apiBody {String} os 핸드폰 OS
 * @apiBody {String} os_version 핸드폰 OS 버전
 * @apiBody {String} app_version 설치 어플 버전
 *
 * 
 *
 * @apiSampleRequest  /user/login
 *
 * @apiExample {curl} Example usage:
 *     curl  --header "Content-Type: application/json"
 *           --request POST 
 *           --data '{
 *                  "user_mobile":"01075293575",
 *                  "user_psword": "12345678",
 *                  "unique_id": "123",
 *                  "push_token": "push",
 *                  "model": "11",
 *                  "os" : "ios",
 *                  "os_version": "10",
 *                  "app_version": "1.0"
 *                  }' 
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