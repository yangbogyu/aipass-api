
//토큰 인증
const jwtKen = require('jsonwebtoken');
const randToken = require('rand-token');
const logger = require('../../winton');
const {secretKey, accessOption, refershOption} = require('../config/secretKey');

class jwt{
    //토큰 발행
    static async sign(user){
        const accessData = {
            user_no: user.user_no,
            user_mobile: user.user_mobile,
            user_name: user.user_name,
            user_code: user.user_code,
        };

        const refershData = {
            user_no: user.user_no,
            user_code: user.user_code,
        };
        const accessToken = jwtKen.sign(accessData, secretKey, accessOption);
        const refershToken = jwtKen.sign(refershData, secretKey, refershOption);
        const token = {accessToken:accessToken, refershToken:refershToken};
        return token;
    }

}

module.exports = jwt;