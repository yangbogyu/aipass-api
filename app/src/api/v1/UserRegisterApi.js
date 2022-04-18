/**
 * @api {post} /user/register 회원 가입
 *
 * @apiDescription   새로운 사용자 정보를 등록합니다.
 *
 * @apiVersion        1.0.0
 * @apiName           user-register
 * @apiGroup          user
 *
 * @apiBody {String} user_mobile 전화번호
 * @apiBody {String} user_psword 비밀번호
 * @apiBody {String} user_code 권한 코드(B001)
 * @apiBody {String} birth 생년월일(1998-12-15)
 * @apiBody {String} gender_code 성별 코드(B002)
 * @apiBody {String} user_name 사용자 이름
 * @apiBody {String} advertise_agree 개인정보 동의(Y/N)
 * @apiBody {String} push_agree 푸시 동의(Y/N)
 * @apiBody {String} information_agree 광고 동의(Y/N)
 *
 * @apiSampleRequest  /user/register
 *
 * @apiExample {curl} Example usage:
 *     curl  --header "Content-Type: application/json"
 *           --request POST 
 *           --data '{"user_mobile":"01075293575", "user_psword": "1234", "user_code: "01", "birth": "1998-12-15", "gender_code": "01"
 *                      ,  "user_name": "양보규", "advertise_agree": "Y", "push_agree": "Y", "information_agree": "Y"}' 
 *           http://api.bogyu98.shop/user/register
 *
 *
 * @apiSuccess {String} result ok
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      {
 *        "result": true
 *      }
 *
 * @apiError {String} message 결과 메시지
 * @apiError {String[]} errors 상세 에러 메시지
 *
 */