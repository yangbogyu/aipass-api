/**
 * @api {get} /user/billing 사용자 결제정보 등록
 *
 * @apiDescription   사용자 결제정보 등록 및 
 *
 * @apiVersion        1.0.0
 * @apiName           user-billing
 * @apiGroup          user-pay
 * 
 * @apiSampleRequest  /user/billing?user_no=&customer_uid=&pay_method=card&apc_no=
 *
 * @apiExample {curl} Example usage:
 *     curl  --header "Content-Type: application/json"
 *           --request GET
 *           https://api.bogyu98.shop/user/billing?user_no=&customer_uid=&pay_method=card&apc_no=
 *
 * @apiSuccess {boolean} success true
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "success": true
 *      }
 *
 * @apiError {boolean} success false
 * @apiError {String} err 에러 메시지
 *
 */

/**
 * @api {get} /user/customer-uid 결제정보 고유번호
 *
 * @apiDescription   결제정보 고유번호
 *
 * @apiVersion        1.0.0
 * @apiName           user-customer-uid
 * @apiGroup          user-pay 
 * @apiHeader {String} Authorization access_token
 * @apiHeaderExample {Header} Header-Example
 *     "Authorization: Bearer 5f048fe"
 * 
 * @apiSampleRequest  /user/customer-uid
 *
 * @apiExample {curl} Example usage:
 *     curl  --header "Content-Type: application/json"
 *           --request GET
 *           https://api.bogyu98.shop/user/customer-uid
 *
 * @apiSuccess {boolean} success true
 * @apiSuccess {Json} data Json
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "success": true,
 *        "data" : {
 *           "customer_uid" : "String"
 *        }
 *      }
 *
 * @apiError {boolean} success false
 * @apiError {String} err 에러 메시지
 *
 */
