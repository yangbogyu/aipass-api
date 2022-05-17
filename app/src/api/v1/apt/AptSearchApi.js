/**
 * @api {get} /apt/:apt_name 아파트 검색
 *
 * @apiDescription   아파트 검색
 *
 * @apiVersion        1.0.0
 * @apiName           apt-arrer
 * @apiGroup          apt
 *
 * @apiHeader {String} Authorization access_token
 * @apiHeaderExample {Header} Header-Example
 *     "Authorization: Bearer 5f048fe"
 * 
 * @apiSampleRequest  /apt/:apt_name
 *
 * @apiParam {String} apt_name 검색 문자열 ex) e편한
 * 
 * @apiExample {curl} Example usage:
 *   curl  --header "Content-Type: application/json"
 *         --request GET
 *       https://api.bogyu98.shop/apt/:apt_name
 *
 * 
 * @apiSuccess {boolean} success true
 * @apiSuccess {String[]} data 결과 데이터
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "success": true,
 *        "data": [
 *              {
 *                  "apt_no": "String",
 *                  "apt_name": "String",
 *                  "sido": "String",
 *                  "gugun": "String",
 *                  "address": "String",
 *              },
 *              {
 *                  "apt_no": "String",
 *                  "apt_name": "String",
 *                  "sido": "String",
 *                  "gugun": "String",
 *                  "address": "String",
 *              }, ....
 *          ]
 *      }
 *
 * @apiError {boolean} success false
 * @apiError {String} err 에러 메시지
 *
 */

/**
 * @api {get} /apt/bldg/:apt_no 아파트 동 검색
 *
 * @apiDescription   아파트 동 검색
 *
 * @apiVersion        1.0.0
 * @apiName           apt-bldg-arrer
 * @apiGroup          apt
 *
 * @apiHeader {String} Authorization access_token
 * @apiHeaderExample {Header} Header-Example
 *     "Authorization: Bearer 5f048fe"
 * 
 * @apiSampleRequest  /apt/bldg/:apt_no
 *
 * @apiParam {String} apt_no 아파트 번호
 * 
 * @apiExample {curl} Example usage:
 *   curl  --header "Content-Type: application/json"
 *         --request GET
 *       https://api.bogyu98.shop/apt/bldg/:apt_no
 *
 * 
 * @apiSuccess {boolean} success true
 * @apiSuccess {String[]} data 결과 데이터
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "success": true,
 *        "data": [
 *              {
 *                  "bldg_no": "String",
 *                  "bldg_name": "String"
 *              },
 *              {
 *                  "bldg_no": "String",
 *                  "bldg_name": "String"
 *              }, ....
 *          ]
 *      }
 *
 * @apiError {boolean} success false
 * @apiError {String} err 에러 메시지
 *
 */


/**
 * @api {get} /apt/home/:bldg_no 아파트 호수 검색
 *
 * @apiDescription   아파트 호수 검색
 *
 * @apiVersion        1.0.0
 * @apiName           bldg-home-arrer
 * @apiGroup          apt
 *
 * @apiHeader {String} Authorization access_token
 * @apiHeaderExample {Header} Header-Example
 *     "Authorization: Bearer 5f048fe"
 * 
 * @apiSampleRequest  /apt/home/:bldg_no
 *
 * @apiParam {String} bldg_no 아파트 번호
 * 
 * @apiExample {curl} Example usage:
 *   curl  --header "Content-Type: application/json"
 *         --request GET
 *       https://api.bogyu98.shop/apt/home/:bldg_no
 *
 * 
 * @apiSuccess {boolean} success true
 * @apiSuccess {String[]} data 결과 데이터
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "success": true,
 *        "data": [
 *              {
 *                  "home_no": "String",
 *                  "home_name": "String"
 *              },
 *              {
 *                  "home_no": "String",
 *                  "home_name": "String"
 *              }, ....
 *          ]
 *      }
 *
 * @apiError {boolean} success false
 * @apiError {String} err 에러 메시지
 *
 */