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
 *           --data '{
 *                  "user_mobile": "01011111139",
 *                  "user_psword": "12345678",
 *                  "user_code": "01",
 *                  "birth": "1998-12-15",
 *                  "gender_code": "01",
 *                  "user_name": "test",
 *                  "advertise_agree": "Y",
 *                  "push_agree": "Y",
 *                  "information_agree": "Y",
 *                  "device_id": "123",
 *                  "push_token": "push",
 *                  "model": "s22",
 *                  "os" : "ios",
 *                  "os_version": "10",
 *                  "app_version": "1.0"
 *              }' 
 *           https://bogyu.shop/user/register
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
 *              "user_name": "String",
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