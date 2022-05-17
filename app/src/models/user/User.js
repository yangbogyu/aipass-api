"use strict";
const createError = require('http-errors');
const UserMapper = require("../../mapper/UserMapper");

const crypto = require('../../public/js/user/crypto');
const {jwt} = require('../jwt');
const logger = require("../../../winton");
const {checkSpecial, checkNum, checkEng, checkSpace} = require('../../public/js/inputRegular');

const checkName = (user_name) =>{
    //이름 체크
    user_name = user_name.replace(/[ ]/gi,''); //이름 공백 제거
    if(!user_name || checkSpecial(user_name))
        return {success: false, status: 404, err:`이름은 특수문자를 포함 할 수 없습니다.`};
    return {success: true, status: 200};

};

const checkPsword = (user_psword) =>{
    if(checkSpace(user_psword) || !checkNum(user_psword) || checkEng(user_psword) ||
    user_psword.length < 6 || user_psword.length > 20)
        return false;
    return true;
};
const CheckRegisterData = (client) =>{
    let data = [];
    if(!client.user_code) data.push("user_code");
    if(!client.birth) data.push("birth");
    if(!client.gender_code) data.push("gender_code");
    if(!client.user_name) data.push("user_name");
    if(!client.advertise_agree) data.push("advertise_agree");
    if(!client.push_agree) data.push("push_agree");
    if(!client.information_agree) data.push("information_agree");
    if(!client.unique_id) data.push("unique_id");
    if(!client.push_token) data.push("push_token");
    if(!client.model) data.push("model");
    if(!client.os) data.push("os");
    if(!client.os_version) data.push("os_version");
    if(!client.app_version) data.push("app_version");
    return data;
}

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
        if(!client.user_mobile  || client.user_mobile.length !== 11)
            return createError(400, new Error('전화번호를 확인 부탁드립니다.'));
        return await UserMapper.login(client.user_mobile)
        .then(async (data) => {
            return await crypto.makePswordHashed(client, data)
            .then(async (data) =>{
                client.refersh_token = data.token.refersh_token;
                return await UserMapper.setDevice(client)
                .then((success) => {return {success: true, status:200, data: data};});
            })
        })
        .catch((err) =>{
            return err;
        });
            
    }

    /**
     * 메인화면용 유저정보 전송
     * 토큰기반 로그인
     * @returns 
     */
    async getUserInfo(){
        const client = this.body;
        return await UserMapper.getUserInfo(client.user_no, client.user_mobile)
        .then((data) => {
            if(!data.user_no) return createError(403, new Error('데이터가 없습니다.'));
            return {success: true, status: 200, data:data};
        })
        .catch((err)=>{
            return err;
        });
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
            return createError(400, new Error('전화번호를 확인 부탁드립니다.'));
        return await UserMapper.getUsers(client.user_mobile)
        .then(async (data) =>{
            logger.info(JSON.stringify(data.use_yn));
            if(data.use_yn)
                return createError(400, new Error('이미 회원가입을 했습니다.'));
            if(!checkPsword(client.user_psword))
                return createError(400, new Error('비밀번호는 6~20자리 이상 숫자로 입력바랍니다.'));

            //비밀번호 암호화
            return await crypto.createHashedPsword(client.user_psword)
            .then(async (hashed) => {
                client.user_psword = hashed.user_psword;
                client.salt = hashed.salt;

                // 고객번호 생성
                const {user_no} = await UserMapper.getUserNo();
                client.user_no = user_no;

                // 회원가입
                const params = CheckRegisterData(client);
                if(params.length != 0) return createError(400, new Error(`Body에 ${params}에 문제가 있습니다.`));
                const token = await jwt.sign(client);
                client.token = token;
                const data = await UserMapper.save(client);
                return {success : true, status: 200, data: data};
            });
        })
        .catch((err) => {return err});
    }


    /**
     * 회원정보 수정
     * @returns 
     */
    async update(){
        const client = this.body;

        // 토큰 정보와 수정자 정보 일치하는지 확인
        if(client.user_no !== client.data.user_no) return createError(400, new Error('토큰정보와 수정하는 정보가 다릅니다.'));
        else delete client.data;

        // 알림과 다른 key 같이 왔는지 파악
        if((client.push_agree || client.advertise_agree) && (client.user_name|| client.user_psword || client.gender_code))
        return createError(400, new Error('(push_agree, advertise_agree)는 개인정보와 한번에 수정 할 수 없습니다.'));

        // 이름 체크 및 공백재거
        if(client.user_name){
            const response = checkName(client.user_name);
            if(response.success == false)
                return response;
            client.user_name = client.user_name.replace(/[ ]/gi,''); //이름 공백 제거
        }
        //비밀번호 체크 및 암호화
        if(client.user_psword){
            if(!checkPsword(client.user_psword)) return createError(400, new Error('비밀번호는 6~20자리 이상 숫자로 입력바랍니다.'));
            const {user_psword, salt } = await crypto.createHashedPsword(client.user_psword);
                client.user_psword = user_psword;
                client.salt = salt;
        }

        // 업데이트
        return await UserMapper.update(client)
        .then(async () => {
            const token = await jwt.sign(client);
            const response = {
                success:true,
                status:200,
                data:{
                    user_no: client.user_no,
                    user_mobile: client.user_mobile,
                    user_name: client.user_name,
                    user_code: client.user_code,
                    token:token,
                }
            };
            return response;
        })
        .catch((err) => {
            return err;
        });
    }

    /**
     * 회원 탈퇴
     * @returns 
     */
    async delete(){
        const client = this.body;

        // 업데이트문으로 처리
        if(client.user_no !== client.data.user_no || client.user_mobile !== client.data.user_mobile) return createError(400, new Error('토큰정보와 수정하는 정보가 다릅니다.'));
        return await UserMapper.delete(client)
        .then(() =>{
            return {success : true, status: 200};
        })
        .catch((err) => {return err;})
        
    }

    /**
     * 메인화면
     */

    async UserApt(){
        const client = this.body;
        return UserMapper.getUserApt(client.user_no)
        .then((data) => {
            logger.info(JSON.stringify(data));
            return {success: true, status:200, data:data};
        })
        .catch((err) => {
            return err;
        })
    }

    async UserScan(){
        const client = this.body;
        return UserMapper.getUserScan(client.user_no)
        .then((data) => {
            const send_date = data.scan_date.replace(/[\[\]]/g,'')
            data.scan_date = send_date.split(', ');
            return {success: true, status:200, data:data};
        })
        .catch((err) => {
            return err;
        })
    }
    
    async Advertise(){
        const client = this.body;
        // 광고관련 테이블 생성 후 수정 필요
        return {success: true, status: 200, data:{
            ad_title: '당근보다 빠른 중고거래',
            ad_text: '중고거래 하고 문상 받자~',
            ad_img: 'https://api.bogyu98.shop/img/ad/test.png',
        }}
    }
}

module.exports = User;