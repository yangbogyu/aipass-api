/**
 * @api {delect} /user/delect 회원 탈퇴
 *
 * @apiDescription   사용자의 데이터를 제거합니다.
 *
 * @apiVersion        1.0.0
 * @apiName           user-delect
 * @apiGroup          user
 *
 * @apiBody {String} user_no 고객번호
 * @apiBody {String} user_mobile 전화번호
 *
 * @apiSampleRequest  /user/delect
 *
 * @apiExample {curl} Example usage:
 *     curl  --header "Content-Type: application/json"
 *           --request POST 
 *           --data '{"user_no":"2022000045",
 *                  "user_mobile":"01075293575"
 *              }' 
 *           http://api.bogyu98.shop/user/delect
 *
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
 * @apiError {String} err 상세 에러 메시지
 *
 */