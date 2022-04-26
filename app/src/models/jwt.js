
//토큰 인증
const jwtKen = require('jsonwebtoken');
const UserMapper = require('../mapper/UserMapper');
const express = require("express");
const logger = require('../../winton');
const {secretKey, accessOption, refershOption} = require('../config/secretKey');

const verifyAccessToken = (req, res, next) =>{
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    if (!accessToken) {
        return res.status(401).json({success: false ,err: "accessToken이 없거나 형식이 잘못되었습니다."});
    }
    
    jwtKen.verify(accessToken, process.env.SECRET_KEY, (error, user) => {
        if (error){ 
            if(error.name === 'TokenExpiredError')
                return res.status(401).json({success: false, err: 'accessToken 만료.'});
            else
                return res.status(401).json({success: false, err: `${error}`});
        }
        req.data=user;
        req.data.status=200;
        next();
    });
  };


class jwt{
    static async access(user){
        const accessData = {
            user_no: user.user_no,
            user_mobile: user.user_mobile,
            user_code: user.user_code,
        };
        const accessToken = jwtKen.sign(accessData, secretKey, accessOption);
        const token = {access_token:accessToken};
        return token;
    }
    //토큰 발행
    static async sign(user){
        const accessData = {
            user_no: user.user_no,
            user_mobile: user.user_mobile,
            user_code: user.user_code,
        };

        const refershData = {
            user_no: user.user_no
        };
        const accessToken = jwtKen.sign(accessData, secretKey, accessOption);
        const refershToken = jwtKen.sign(refershData, secretKey, refershOption);
        const update = await UserMapper.setRefersh(user.user_no, refershToken);
        if(update.err){
            return {err: `${err}`};
        }
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
                        reject({status: 401, err : `refreshToken 만료`});
                    else
                        reject({ status: 401, err: `${error}`});
                } else{
                    const now = Math.floor(new Date().getTime() / 1000);
                    const month = 60*60*24*30;
                    const response = await UserMapper.getRefersh(user.user_no,refreshToken);
                        if(response.err){
                            resolve({status: 401, err : `refreshToken 다름`});
                        }
                    if (user.exp - now < month){ // refreshToken 기간이 30일 이하 남으면 새로 발급
                        const token = await this.sign(user);
                        resolve({status: 200, data: token});
                    } else {
                        const token = await this.access(user);
                        resolve({status: 200, data: token});
                    }
                }
            });
        })
        .catch((err) =>{
            return {status: err.status, err:err.err};
        }); 
        
        return res;
    }
}

module.exports = {jwt, verifyAccessToken};