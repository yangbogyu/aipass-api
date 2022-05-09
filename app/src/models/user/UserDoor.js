"use strict";

const UserDoorMapper = require("../../mapper/UserDoorMapper");

const crypto = require('../../public/js/user/crypto');
const logger = require("../../../winton");

class UserDoor{
    constructor(body){
        this.body = body;
    }

    async homeRegister(){
        const data = this.body;
        try{
            data.apc_no = await UserDoorMapper.getApcNo();
            switch (data.apc_dv_cd){ // 신청 구분 코드(B010)
                case '01':// 호 출입
                    if(!data.bldg_no || !data.home_no) return{success: false, status:400, err:`${new Error('데이터 오류.')}`};
                    return await UserDoorMapper.checkHome(data)
                        .then(async ({householder, duplicate}) => {
                            if(duplicate !== 0) return{success: false, status:400, err:`${new Error('중복 신청입니다.')}`};
                            switch (data.user_dv_cd){ //출입 구분 코드(B011)
                                case '01': //세대주
                                    if(householder !== 0) return {success: false, status:400, err:`${new Error('이미 승인 받은 세대주 있음')}`};
                                    return await UserDoorMapper.homeRegister(data)
                                    .then((apt) => {
                                        apt.apt_no = data.apt_no;
                                        apt.apc_no = data.apc_no;
                                        logger.info(JSON.stringify(apt));
                                        return {success: true, code:0, status:200, data:apt};
                                    });
                                case '02': //세대원
                                    if(householder !== 1) return {success: false, status:400, err:`${new Error('세대주로 신청 바랍니다.')}`};
                                    return await UserDoorMapper.homeRegister(data)
                                    .then((apt) => {
                                        apt.apt_no = data.apt_no;
                                        logger.info(JSON.stringify(apt));
                                        return {success: true, code:0, status:200, data:{}};
                                    });
                                default:
                                    return {success: false, status:400 , err: `${new Error('(user_dv_cd)출입 구분 코드 오류')}`};
                            };
                        }).catch((err)=> {return {success: false, status:400 , err:`${err}`};});
                case '02':// 동 출입
                case '03':// 단지 출입
                    if(data.user_dv_cd !== '09') // 기타 신청인지 파악
                        return {success: false, status:400 , err: `${new Error('(user_dv_cd)출입 구분 코드 오류')}`};
                    return await UserDoorMapper.aptRegister(data)
                        .then((bool) => {
                            logger.info(bool);
                            return {success: true, code:0, status:200, data:{}};
                        });
                default:
                    return {success: false, status:400 , err: `${new Error('(apc_dv_cd)신청 구분 코드 오류')}`};
                    
            };
            
        }catch(err) {
            return {success: false, status:400 , err:`${err}`}
        }
        
    }
    
}


module.exports = UserDoor;