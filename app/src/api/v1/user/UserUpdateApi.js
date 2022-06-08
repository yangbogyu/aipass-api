/**
 * @api {post} /user/update 회원정보 수정
 *
 * @apiDescription   사용자 정보를 수정합니다. [광고/푸시와 다른 정보 한번에 수정 불가능]
 *
 * @apiVersion        1.0.0
 * @apiName           user-update
 * @apiGroup          user
 * 
 * @apiHeader {String} Authorization access_token
 * @apiHeaderExample {Header} Header-Example
 *     "Authorization: Bearer 5f048fe"
 * 
 * @apiBody {String} user_no 고객번호
 * @apiBody {String} user_mobile 전화번호
 * @apiBody {String} user_psword 비밀번호
 * @apiBody {String} gender_code 성별 코드(B002)
 * @apiBody {String} user_name 사용자 이름
 * @apiBody {String} push_agree 푸시 동의(Y/N)
 * @apiBody {String} information_agree 광고 동의(Y/N)
 *
 * @apiSampleRequest  /user/update
 *
 * @apiExample {curl} Example usage:
 *     curl  --header "Content-Type: application/json"
 *           --request POST 
 *           --data '{
 *                  "user_no":"2022000045",
 *                  "user_mobile":"01012341234",
 *                  "user_psword": "12345678",
 *                  "gender_code": "01",
 *                  "user_name": "test"
 *              }' 
 *           https://api.bogyu98.shop/user/update
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
 *              "user_name": "String",
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