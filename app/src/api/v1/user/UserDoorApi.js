/**
 * @api {put} /user/home-register 출입문 신청
 *
 * @apiDescription   사용자의 출입문 신청입니다.
 *
 * @apiVersion        1.0.0
 * @apiName           user-update
 * @apiGroup          user
 * 
 * @apiHeader {String} Authorization access_token
 * @apiHeaderExample {Header} Header-Example
 *     "Authorization: Bearer 5f048fe"
 * 
 * @apiBody {String} apc_dv_cd *신청 구분코드(B010)
 * @apiBody {String} user_dv_cd *출입 구분코드(B011)
 * @apiBody {String} user_no *고객번호
 * @apiBody {String} apc_date *신청일시(2020-01-01)
 * @apiBody {String} start_date 시작일시(2020-01-01)
 * @apiBody {String} end_date 종료일시(2020-01-01)
 * @apiBody {String} apt_no *아파트번호
 * @apiBody {String} bldg_no 건물 번호
 * @apiBody {String} home_no 호수 번호
 *
 * @apiSampleRequest  /user/home-register
 *
 * @apiExample {curl} Example usage:
 *     curl  --header "Content-Type: application/json"
 *           --request POST 
 *           --data '{"apc_dv_cd": "String",
 *              "user_dv_cd": "String",
 *              "user_no": "String",
 *              "apc_date": "String",
 *              "start_date": "String",
 *              "end_date": "String",
 *              "apt_no": "String",
 *              "bldg_no": "String",
 *              "home_no": "String"
 *              }' 
 *           https://bogyu.shop/user/home-register
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
 *              "total_pay_yn": "String",
 *              "contract_type": "String",
 *              "apt_no": "String",
 *              "apc_no": "String"
 *          }
 *      }
 *
 * @apiError {boolean} success false
 * @apiError {String} err 상세 에러 메시지
 *
 */