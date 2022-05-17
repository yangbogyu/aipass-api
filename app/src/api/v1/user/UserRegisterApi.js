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
 * @apiBody {String} unique_id 기기 아이디
 * @apiBody {String} push_token 푸시 토큰
 * @apiBody {String} model 핸드폰 기종
 * @apiBody {String} os 핸드폰 OS
 * @apiBody {String} os_version 핸드폰 OS 버전
 * @apiBody {String} app_version 설치 어플 버전
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
 *                  "unique_id": "123",
 *                  "push_token": "push",
 *                  "model": "11",
 *                  "os" : "ios",
 *                  "os_version": "10",
 *                  "app_version": "1.0"
 *              }' 
 *           https://api.bogyu98.shop/user/register
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