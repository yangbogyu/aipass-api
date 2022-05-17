"use strict";

const createError = require('http-errors');
const crypto = require('crypto');
const logger = require('../../../../winton');
const {jwt} = require('../../../models/jwt');

const createSalt = () =>
    new Promise((resolve, reject) => {
        crypto.randomBytes(32, (err, buf) => {
            if (err) reject(err);
            resolve(buf.toString('base64'));
        });
    });

class HashedPsword{

    /**
     * 비밀번호를 가져와서 암호화된 비밀번호 반환
     * @param {String} user_psword 
     * @returns {String}
     */
    static async createHashedPsword(user_psword){
        return new Promise(async (resolve, reject) => {
            const salt = await createSalt(); // 비밀번호를 위한 특정 문자열
            crypto.pbkdf2(user_psword, salt, 9999, 64, 'sha512', (err, key) => {
                if (err) reject(err);
                resolve({ user_psword: key.toString('base64'), salt });
            });
        });
    }
        
    /**
     * 입력한 비밀번호가 맞는지 확인을 하는 문자열 생성 함수
     * @param {String} user_psword 
     * @param {String} salt 
     * @returns {String}
     */
    static async makePswordHashed(client, data) {
        return new Promise(async (resolve, reject) => {
            crypto.pbkdf2(client.user_psword, data.salt, 9999, 64, 'sha512', async (err, key) => {
                if (err) reject(err);
                else if(data.user_mobile === client.user_mobile && data.user_psword === key.toString('base64')){
                    return await jwt.sign(data)
                    .then(async (token) =>{
                        delete data.salt;
                        delete data.user_psword;
                        data.token = token;
                        resolve(data);
                    });
                } else {
                    logger.error(3);
                    reject(createError(400, new Error(`비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.`)));
                }
            });
        });
    }
}
module.exports = HashedPsword;