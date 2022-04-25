
//토큰 인증
const jwtKen = require('jsonwebtoken');
const http = require("http");
const express = require("express");
const logger = require('../../winton');
const {secretKey, accessOption, refershOption} = require('../config/secretKey');

class jwt{
    //토큰 발행
    static async sign(user){
        const accessData = {
            user_no: user.user_no,
            user_mobile: user.user_mobile,
            user_code: user.user_code,
        };

        const refershData = {
            user_no: user.user_no,
            user_mobile: user.user_mobile,
            user_code: user.user_code,
        };
        const accessToken = jwtKen.sign(accessData, secretKey, accessOption);
        const refershToken = jwtKen.sign(refershData, secretKey, refershOption);
        const token = {access_token:accessToken, refersh_token:refershToken};
        return token;
    }


    // access_token refresh_token 기반 재생성
    static async setAccessToken(refreshToken){

        if(!refreshToken) return {status: 401, err:"refreshToken이 없거나 형식이 잘못되었습니다."}
        const res =  new Promise(async (resolve, reject) =>{
            jwtKen.verify(
            refreshToken,
            process.env.SECRET_KEY,
            async (error, user) =>{
                if(error) {
                    if(error.name === 'TokenExpiredError')
                        reject({status: 403, err : `refreshToken 만료`});
                    else
                        reject({ status: 403, err: `${error}`});
                } else{
                    const token = await this.sign(user);
                    resolve({status: 200, data: token});
                }
            });
        })
        .catch((err) =>{
            return {status: err.status, err:err.err};
        }); 
        
        return res;
    }
}

module.exports = jwt;