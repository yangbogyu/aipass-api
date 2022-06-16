/**
 * @api {get} /user/apt-info 사용자 출입문정보
 *
 * @apiDescription   APP 메인화면용 출입문 정보
 *
 * @apiVersion        1.0.0
 * @apiName           user-apt-info
 * @apiGroup          user-main
 * @apiHeader {String} Authorization access_token
 * @apiHeaderExample {Header} Header-Example
 *     "Authorization: Bearer 5f048fe"
 * 
 * @apiSampleRequest  /user/apt-info
 *
 * @apiExample {curl} Example usage:
 *     curl  --header "Content-Type: application/json"
 *           --request GET
 *           https://api.bogyu98.shop/user/apt-info
 *
 * @apiSuccess {boolean} success true
 * @apiSuccess {String[]} data 결과 데이터
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "success": true,
 *        "data": [
 *                  {
 *                      "apc_no": "2022000073",
 *                      "user_dv_cd": "세대주",
 *                      "apv_yn": "N",
 *                      "apt_name": "AI패스-수정테스트",
 *                      "bldg_name": "103동",
 *                      "home_name": "404호",
 *                      "advertise_yn": "Y",
 *                      "total_pay_yn": "N",
 *                      "payment_yn": "N",
 *                      "apt_amount" : 1000,
 *                      "title_yn": "Y"
 *                  }, ...
 *              ]
 *          }
 *      }
 *
 * @apiError {boolean} success false
 * @apiError {String} err 에러 메시지
 *
 */

/**
 * @api {get} /user/scan-info 사용자 스켄정보
 *
 * @apiDescription   APP 메인화면용 사용자 출입문 블루투스 스켄 정보
 *
 * @apiVersion        1.0.0
 * @apiName           user-scan-info
 * @apiGroup          user-main
 * @apiHeader {String} Authorization access_token
 * @apiHeaderExample {Header} Header-Example
 *     "Authorization: Bearer 5f048fe"
 * 
 * @apiSampleRequest  /user/scan-info
 *
 * @apiExample {curl} Example usage:
 *     curl  --header "Content-Type: application/json"
 *           --request GET
 *           https://api.bogyu98.shop/user/scan-info
 *
 * @apiSuccess {boolean} success true
 * @apiSuccess {String} data 결과 데이터
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "success": true,
 *        "data": {
 *              "scan_yn": "Y",
 *              "start_time": "0000",
 *              "end_time": "2359",
 *              "scan_date_yn": "Y",
 *              "scan_date": [
 *                  "1",
 *                  "2",
 *                  "3",
 *                  "4",
 *                  "5"
 *              ]
 *          }
 *      }
 *
 * @apiError {boolean} success false
 * @apiError {String} err 에러 메시지
 *
 */

/**
 * @api {get} /user/advertise-info 메인화면 광고
 *
 * @apiDescription   APP 메인화면 네이티브 광고 정보
 *
 * @apiVersion        1.0.0
 * @apiName           user-advertise-info
 * @apiGroup          user-main
 * @apiHeader {String} Authorization access_token
 * @apiHeaderExample {Header} Header-Example
 *     "Authorization: Bearer 5f048fe"
 * 
 * @apiSampleRequest  /user/advertise-info
 *
 * @apiExample {curl} Example usage:
 *     curl  --header "Content-Type: application/json"
 *           --request GET
 *           https://api.bogyu98.shop/user/advertise-info
 *
 * @apiSuccess {boolean} success true
 * @apiSuccess {String[]} data 결과 데이터
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "success": true,
 *        "data": {
 *              "title": "당근보다 빠른 중고거래",
 *              "body": "중고거래 하고 문상 받자~",
 *              "img": "https://api.api.bogyu98.shop/img/ad/test.png"
 *          }
 *      }
 *
 * @apiError {boolean} success false
 * @apiError {String} err 에러 메시지
 *
 */