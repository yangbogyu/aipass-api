"use strict";

const UserMapper = require("../../mapper/UserMapper");

const crypto = require('crypto');
const jwt = require('../jwt');
const logger = require("../../../winton");

const createSalt = () =>
    new Promise((resolve, reject) => {
        crypto.randomBytes(32, (err, buf) => {
            if (err) reject(err);
            resolve(buf.toString('base64'));
        });
    });

const createHashedPassword = (user_psword) =>
    new Promise(async (resolve, reject) => {
        const salt = await createSalt();
        crypto.pbkdf2(user_psword, salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve({ user_psword: key.toString('base64'), salt });
        });
    });

const makePasswordHashed = (user_psword, salt) =>
    new Promise(async (resolve, reject) => {
        crypto.pbkdf2(user_psword, salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve(key.toString('base64'));
        });
    });

class User{
    constructor(body){
        this.body = body;
    }
    
    /**
     * 로그인
     * 
     */
    async login(){
        const client = this.body;
        try{
            const data = await UserMapper.getUserInfo(client.user_mobile);
            if(data.user_mobile) {
                client.user_psword = await makePasswordHashed(client.user_psword, data.salt);
                if(data.user_mobile === client.user_mobile && data.user_psword === client.user_psword){
                    const token = await jwt.sign(data);
                    delete data.salt;
                    delete data.user_psword;
                    return {success : true,
                            token : token,
                            response : data};
                } 
                return {success : false, err:"비밀번호가 틀렸습니다."};
            }
            return {success : false, err:"아이디가 없습니다."};
        } catch(err){
            return {success : false, err:`${err}`};
        }
         
    }

    /**
     * 회원가입
     * 
     */
    async register(){
        const client = this.body;

        //유효성 체크
        if(!client.user_mobile  || client.user_mobile.length !== 11)
            return {success : false, err:`전화번호를 확인해주세요`};
        const {use_yn} = await UserMapper.getUsers(client.user_mobile);
        if(use_yn)
            return {success : false, err:`이미 회원가입을 했습니다.`};
        if(client.user_psword.length < 8 || client.user_psword.length > 20)
            return {success : false, err:`비밀번호는 8~20자리로 입력해주세요`};

        //비밀번호 암호화
        const {user_psword, salt } = await createHashedPassword(client.user_psword);
        client.user_psword = user_psword;
        client.salt = salt;

        // 고객번호 생성
        const {user_no} = await UserMapper.getUserNo();
        client.user_no = user_no;

        // 회원가입
        try{
            const response = await UserMapper.save(client);
            const token = await jwt.sign(client);
            response.token = token;
            return response;
        }catch(err){
            return {success : false, err:`${err}`};
        }
        
    }

}

module.exports = User;