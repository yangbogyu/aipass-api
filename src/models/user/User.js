"use strict";

const UserMapper = require("../../mapper/UserMapper");

const crypto = require('crypto');
const logger = require("../../../winton");
const createSalt = () =>
    new Promise((resolve, reject) => {
        crypto.randomBytes(32, (err, buf) => {
            if (err) reject(err);
            resolve(buf.toString('base64'));
        });
    });
const createHashedPassword = (plainPassword) =>
    new Promise(async (resolve, reject) => {
        const salt = await createSalt();
        crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve({ user_psword: key.toString('base64'), salt });
        });
    });

    
class User{
    constructor(body){
        this.body = body;
    }
    
    /*
    async login(){
        const client = this.body;
        try{
            const {id, psword} = await UserMapper.getUserInfo(client.id);

            const { password, salt } = await createHashedPassword(psword);
            console.log(password, salt);
            if(id) {
                if(id === client.id && psword === client.psword){
                    return {success : true};
                } 
                return {success : false, msg:"비밀번호가 틀렸습니다."};
            }
            return {success : false, msg:"아이디가 없습니다."};
        } catch(err){
            return {success : false, err:`${err}`};
        }
         
    }
    */

    async register(){
        const client = this.body;
        const {user_psword, salt } = await createHashedPassword(client.user_psword);
        client.user_psword = user_psword;
        client.salt = salt;
        const {user_no} = await UserMapper.getUserNo();
        client.user_no = user_no;
        logger.info("회원 정보"+ JSON.stringify(client));
        try{
            const response = await UserMapper.save(client);
            return response;
        }catch(err){
            return {success : false, err:`${err}`};
        }
        
    }
}

module.exports = User;