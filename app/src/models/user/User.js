"use strict";

const UserMapper = require("../../mapper/UserMapper");

const crypto = require('../../public/js/user/crypto');
const {jwt} = require('../jwt');
const logger = require("../../../winton");
const {checkSpecial, checkEngNum, checkSpace} = require('../../public/js/inputRegular');

const checkData = (client) =>{
    //이름 체크
    client.user_name = client.user_name.replace(/[ ]/gi,''); //이름 공백 제거
    if(!client.user_name || checkSpecial(client.user_name))
        return {success: false, status: 400, err:`이름은 특수문자를 포함 할 수 없습니다.`};
    
    if(checkSpace(client.user_psword) || checkEngNum(client.user_psword) ||
    client.user_psword.length < 8 || client.user_psword.length > 20)
        return {success: false, status: 400, err:`비밀번호는 영문과 숫자를 이용하여 8 ~ 20 자리로 생성바랍니다.`};
    return {success: true, status: 200};
};

class User{
    constructor(body){
        this.body = body;
    }
    
    /**
     * 로그인 로직
     * 로그인 성공시 자동 로그인을위한 토큰값 전달
     * @returns {status: int , data: {token: String}}
     */
    async login(){
        const client = this.body;
        try{
            const data = await UserMapper.login(client.user_mobile);
            if(data.user_mobile) {
                client.user_psword = await crypto.makePswordHashed(client.user_psword, data.salt);
                if(data.user_mobile === client.user_mobile && data.user_psword === client.user_psword){
                    const token = await jwt.sign(data);
                    delete data.salt;
                    delete data.user_psword;
                    data.token = token;
                    return {success: true, status: 200, data : data};
                } 
                return {success: false, status: 400, err:"비밀번호가 틀렸습니다."};
            }
            return {success: false, status: 400, err:"아이디가 없습니다."};
        } catch(err){
            return {success: false, status: 400, err:`${err}`};
        }
    }

    /**
     * 
     */
    async getUserInfo(){
        const client = this.body;
        logger.info(JSON.stringify(client));
        try{
            if(client.err) return {status: client.status, err:client.err};
            const data = await UserMapper.getUserInfo(client.user_no, client.user_mobile);
            if(data.err){
                return {success: false, status: 401, err:data.err};
            }
            return {success: true, status: 200, data:data};

        } catch(err){
            return {success: false, status: 401, err:err};
        }
    }

    /**
     * 회원가입 로직
     * 정상적으로 회원가입을 성공했을경우 자동 로그인 토큰값 전달
     * @returns {success: bool , data: {token: String}}
     */
    async register(){
        const client = this.body;

        //유효성 체크
        if(!client.user_mobile  || client.user_mobile.length !== 11)
            return {success : false, status: 400, err:`전화번호를 확인해주세요`};
        const {use_yn} = await UserMapper.getUsers(client.user_mobile);
        if(use_yn)
            return {success : false, status: 400, err:`이미 회원가입을 했습니다.`};
        if(client.user_psword.length < 8 || client.user_psword.length > 20)
            return {success : false, status: 400, err:`비밀번호는 8~20자리로 입력해주세요`};

        //비밀번호 암호화
        const {user_psword, salt } = await crypto.createHashedPsword(client.user_psword);
        client.user_psword = user_psword;
        client.salt = salt;

        // 고객번호 생성
        const {user_no} = await UserMapper.getUserNo();
        client.user_no = user_no;

        // 회원가입
        try{
            const token = await jwt.sign(client);
            client.token = token;
            const data = await UserMapper.save(client);
            
            return {success : true, status: 200, data: data};
        }catch(err){
            return {success : false, status: 400, err:`${err}`};
        }
        
    }


    /**
     * 회원정보 수정
     * @returns 
     */
    async update(){
        const client = this.body;
        let response = checkData(client)
        if(response.success == false)
            return response;

        //비밀번호 암호화
        const {user_psword, salt } = await crypto.createHashedPsword(client.user_psword);
        client.user_psword = user_psword;
        client.salt = salt;

        // 업데이트
        try{
            response = await UserMapper.update(client);
            const token = await jwt.sign(client);
            response.data = {
                user_no: client.user_no,
                user_mobile: client.user_mobile,
                user_name: client.user_name,
                user_code: client.user_code,
                token:token,
            };
            return response;
        }catch(err){
            return {success : false, status: 400, err:`${err}`};
        }
        
    }

    /**
     * 회원 탈퇴
     * @returns 
     */
    async delete(){
        const client = this.body;

        // 업데이트문으로 처리
        try{
            const response = await UserMapper.delete(client);
            if(response.err){
                return {success : false, status: 400, err:`${response.err}`};
            }
            return response;
        }catch(err){
            return {success : false, status: 400, err:`${err}`};
        }
    }

}

module.exports = User;