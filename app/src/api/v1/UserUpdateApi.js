/**
 * @api {put} /user/update 회원정보 수정
 *
 * @apiDescription   사용자 정보를 수정합니다.
 *
 * @apiVersion        1.0.0
 * @apiName           user-update
 * @apiGroup          user
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
 *           --data '{"user_no":"2022000045",
 *                  "user_mobile":"01075293575",
 *                  "user_psword": "1234",
 *                  "gender_code": "01",
 *                  "user_name": "양보규",
 *                  "push_agree": "Y",
 *                  "information_agree": "Y",
 *              }' 
 *           http:/192.168.1.206:5000/user/update
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