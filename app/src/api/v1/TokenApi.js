/**
 * @api {post} /refresh 토큰 재발급
 *
 * @apiDescription   로그인 인증정보 토큰 재발급
 *
 * @apiVersion        1.0.0
 * @apiName           token-refresh
 * @apiGroup          toekn
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
 *           https://bogyu.shop/refresh
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
 *                  "accessToken": "token",
 *                  "refershToken": "token"
 *              }
 *          }
 *      }
 *
 * @apiError {boolean} success false
 * @apiError {String} err 상세 에러 메시지
 *
 */