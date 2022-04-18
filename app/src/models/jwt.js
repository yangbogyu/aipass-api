
//토큰 인증
const jwtKen = require('jsonwebtoken');
const randToken = require('rand-token');
const logger = require('../../winton');
const {secretKey, option} = require('../config/secretKey');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

class jwt{
    //토큰 발행
    static async sign(user){

        const data = {
            user_no: user.user_no,
            user_mobile: user.user_mobile,
            user_code: user.user_code,
        };
        logger.info(JSON.stringify(data));
        const token = jwtKen.sign(data, secretKey, option);
        return token;
    }

    //토큰 조회
    static async verify(token){
        const decoded ="";
        try {
            // verify를 통해 값 decode!
            decoded = jwtKen.verify(token, secretKey);
        } catch (err) {
            if (err.message === 'jwt expired') {
                console.log('expired token');
                return TOKEN_EXPIRED;
            } else if (err.message === 'invalid token') {
                console.log('invalid token');
                console.log(TOKEN_INVALID);
                return TOKEN_INVALID;
            } else {
                console.log("invalid token");
                return TOKEN_INVALID;
            }
        }
        return decoded;
    }
    static async checkToken(req, res, next){
        const token = req.headers.token;
        // 토큰 없음
        if (!token)
            return {success : false, err:`토큰이 없습니다.`};
        // decode
        const user = await jwt.verify(token);
        // 유효기간 만료
        if (user === TOKEN_EXPIRED)
            return {success : false, err:`유효기간 만료`};
        // 유효하지 않는 토큰
        if (user === TOKEN_INVALID)
            return {success : false, err:`유요하지 않는 토큰`};
        if (user.user_no === undefined)
            return {success : false, err:`유요하지 않는 토큰`};
        req.user_no = user.user_no;
        next(); 
    }
}

module.exports = jwt;