const logger = require("../../winton");

logger.info("토큰설정 ");
const secretKey = process.env.SECRET_KEY; // 원하는 시크릿 키

const option = {
        algorithm : process.env.ALGORITHM, // 해싱 알고리즘
        expiresIn : process.env.EXPIRESIN,  // 토큰 유효 기간
        issuer : process.env.ISSUSER, // 발행자
    }
module.exports = {
    secretKey,
    option
}