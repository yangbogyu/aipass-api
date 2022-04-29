"use strict";

const UserMapper = require("../../mapper/UserMapper");

const crypto = require('../../public/js/user/crypto');
const {jwt} = require('../jwt');
const logger = require("../../../winton");
const {checkSpecial, checkEngNum, checkSpace} = require('../../public/js/inputRegular');

const checkName = (user_name) =>{
    //이름 체크
    user_name = user_name.replace(/[ ]/gi,''); //이름 공백 제거
    if(!user_name || checkSpecial(user_name))
        return {success: false, status: 400, err:`이름은 특수문자를 포함 할 수 없습니다.`};
    return {success: true, status: 200};
};
const checkPsword = (user_psword) =>{
   
    if(checkSpace(user_psword) || checkEngNum(user_psword) ||
    user_psword.length < 8 || user_psword.length > 20)
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
     * @returns 
     */
    async login(){
        const client = this.body;
        try{
            return await UserMapper.login(client.user_mobile)
            .then(async (data) => {
                logger.info(JSON.stringify(data));
                return await crypto.makePswordHashed(client.user_psword, data.salt)
                .then(async (user_psword) =>{
                    if(data.user_mobile === client.user_mobile && data.user_psword === user_psword){
                        return await jwt.sign(data)
                        .then(async (token) =>{
                            delete data.salt;
                            delete data.user_psword;
                            data.token = token;
                            return {success: true, status: 200, data : data};
                        });
                    }
                    return {success: false, status: 400, err: "비밀번호가 틀렸습니다."};
                })
                .catch((err) =>{
                    return {success: false, status: 400, err:`${err}`};
                });
            })
            .catch((err) =>{
                return {success: false, status: 400, err:`${err}`};
            });
        } catch(err){
            return {success: false, status: 400, err:`${err}`};
        }
    }

    /**
     * 메인화면용 유저정보 전송
     * 토큰기반 로그인
     * @returns 
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
     * @returns 
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

        // 토큰 정보와 수정자 정보 일치하는지 확인
        if(client.user_no !== client.data.user_no) return {success: false, status: 401, err:'토큰정보와 수정하는 정보가 다릅니다.'};
        else delete client.data;

        // 알림과 다른 key 같이 왔는지 파악
        if((client.push_agree || client.advertise_agree) && (client.user_name|| client.user_psword || client.gender_code))
            return {success: false, status: 400, err:'알림과 개인정보는 한번에 수정 할 수 없습니다.'};

        // 이름 체크 및 공백재거
        if(client.user_name){
            const response = checkName(client.user_name);
            if(response.success == false)
                return response;
            client.user_name = client.user_name.replace(/[ ]/gi,''); //이름 공백 제거
        }
        //비밀번호 체크 및 암호화
        if(client.user_psword){
            const response = checkPsword(client.user_psword);
            if(response.success == false)
                return response;
            const {user_psword, salt } = await crypto.createHashedPsword(client.user_psword);
            client.user_psword = user_psword;
            client.salt = salt;
        }

        // 업데이트
        try{
            const response = await UserMapper.update(client);
            if(response.err){
                return{success : false, status: 400, err:`${response.err}`};
            }
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
            logger.info(JSON.stringify(client));
            if(client.user_no !== client.data.user_no) return {success : false, status: 400, err:`고객정보 다름`};

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