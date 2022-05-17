
//토큰 인증
const jwtKen = require('jsonwebtoken');
const UserMapper = require('../mapper/UserMapper');
const logger = require('../../winton');
const {secretKey, accessOption, refershOption} = require('../config/secretKey');
const {isEmpty} = require('../public/js/inputRegular');

const createError = require('http-errors');

const verifyAccessToken = (req, res, next) =>{
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    if (!accessToken) {
        return res.status(401).json({success: false ,err: "accessToken이 없거나 형식이 잘못되었습니다."});
    }
    
    jwtKen.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
        if (err){
            next(createError(401,err));
        } else {
            req.data=user;
            req.data.status=200;
            next();
        }
        
    });
  };

const accessTokenData = (req, res, next)=>{
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    jwtKen.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
        if(err && err.name !== 'TokenExpiredError'){
            next(createError(401,err));
        } else{
            next();
        }
        
    });
}

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
        return await UserMapper.setRefersh(user.user_no, refershToken)
        .then(() => {
            const token = {access_token:accessToken, refersh_token:refershToken};
            return token;
        })
        .catch((err) => {
            return err;
        });
    }


    // access_token refresh_token 기반 재생성
    static async setAccessToken(req){
        const body = req.body;
        const res =  new Promise(async (resolve, reject) =>{
            jwtKen.verify(
            body.refersh_token,
            process.env.SECRET_KEY,
            async (err, user) =>{
                if(err) {
                    reject(createError(401,err));
                } else{
                    const now = Math.floor(new Date().getTime() / 1000);
                    const month = 60*60*24*30;

                    const response = await UserMapper.getRefersh(user.user_no);

                    if(response.err) reject(createError(response));
                    else if(response.unique_id !== body.unique_id) reject(createError(403,new Error('unique_id 가 다릅니다.')));
                    else if(response.refersh_token !== body.refersh_token) reject(createError(403,new Error('refersh_token 가 다릅니다.')));
                    else {
                        user.user_code = response.user_code;
                        user.user_mobile = response.user_mobile;
                        if (user.exp - now < month){ // refreshToken 기간이 30일 이하 남으면 새로 발급
                            const token = await this.sign(user);
                            resolve({success: true, status: 200, data: token});
                        } else {
                            const token = await this.access(user);
                            resolve({success: true, status: 200, data: token});
                        }
                    }
                }
            });
        })
        .catch((err) =>{
            return err;
        }); 
        
        return res;
    }

}

module.exports = {jwt, verifyAccessToken, accessTokenData};