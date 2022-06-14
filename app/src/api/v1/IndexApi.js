/**
 * @api {post} /webhook 결제 웹훅
 *
 * @apiDescription   결제 웹훅
 *
 * @apiVersion        1.0.0
 * @apiName           pay-webhook
 * @apiGroup          index
 * 
 * @apiBody {String} imp_uid 아임포트 주문번호
 * @apiBody {String} merchant_uid 주문번호
 * @apiBody {String} status 결제 상태
 *
 *
 * @apiSampleRequest  /webhook
 *
 * @apiExample {curl} Example usage:
 *     curl  --header "Content-Type: application/json"
 *           --request POST 
 *           --data '{"imp_uid":"imp_uid",
 *                  "merchant_uid": "merchant_uid",
 *                  "status" : "paid"
 *              }' 
 *           https://api.bogyu98.shop/webhook
 *
 *
 * @apiSuccess {boolean} success true
 * @apiSuccess {String[]} data 결과 데이터
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "success": true
 *      }
 *
 * @apiError {boolean} success false
 * @apiError {String} err 상세 에러 메시지
 *
 */

/**
 * @api {post} /refresh 토큰 재발급
 *
 * @apiDescription   로그인 인증정보 토큰 재발급
 *
 * @apiVersion        1.0.0
 * @apiName           token-refresh
 * @apiGroup          index
 * 
 * @apiHeader {String} Authorization access_token
 * @apiHeaderExample {Header} Header-Example
 *     "Authorization: Bearer 5f048fe"
 * 
 * @apiBody {String} refresh_token 재발급 토큰
 * @apiBody {String} unique_id 디바이스 체크
 *
 *
 * @apiSampleRequest  /refresh
 *
 * @apiExample {curl} Example usage:
 *     curl  --header "Content-Type: application/json"
 *           --request POST 
 *           --data '{"refresh_token":"5f048fe"
 *                  "unique_id": "unique_id"
 *              }' 
 *           https://api.bogyu98.shop/refresh
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
 *              "token": {
 *                  "access_token": "token",
 *                  "refersh_token": "token"
 *              }
 *          }
 *      }
 *
 * @apiError {boolean} success false
 * @apiError {String} err 상세 에러 메시지
 *
 */