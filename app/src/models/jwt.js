
//토큰 인증
const jwtKen = require('jsonwebtoken');
const randToken = require('rand-token');
const logger = require('../../winton');
const {secretKey, accessOption, refershOption} = require('../config/secretKey');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

class jwt{
    //토큰 발행
    static async sign(user){
        const data = {
            user_no: user.user_no,
            user_mobile: user.user_mobile,
            user_name: user.user_name,
            user_code: user.user_code,
        };
        const accessToken = jwtKen.sign(data, secretKey, accessOption);
        const refershToken = jwtKen.sign(data, secretKey, refershOption);
        data.token = {accessToken:accessToken, refershToken:refershToken};
        return data;
    }

}

module.exports = jwt;