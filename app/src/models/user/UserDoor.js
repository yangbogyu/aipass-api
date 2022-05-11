"use strict";

const UserDoorMapper = require("../../mapper/UserDoorMapper");

const crypto = require('../../public/js/user/crypto');
const logger = require("../../../winton");
const {isEmpty} = require('../../public/js/inputRegular');

class UserDoor{
    constructor(body){
        this.body = body;
    }

    async homeRegister(){
        const data = this.body;
        try{
            data.apc_no = await UserDoorMapper.getApcNo();
            if(isEmpty(data.apc_dv_cd) || isEmpty(data.user_dv_cd) || isEmpty(data.user_no)) return {success: false, status:400, err:`${new Error('데이터 오류.')}`};
            
            switch (data.apc_dv_cd){ // 신청 구분 코드(B010)
                case '01':// 호 출입
                    if(isEmpty(data.bldg_no) || isEmpty(data.home_no)) return {success: false, status:400, err:`${new Error('데이터 오류.')}`};

                    return await UserDoorMapper.checkHome(data)
                        .then(async (householder) => {
                            if(await UserDoorMapper.duplicate(data) != 0) return {success: false, status:400, err:`${new Error('이미 신청하셨습니다.')}`};
                            switch (data.user_dv_cd){ //출입 구분 코드(B011)
                                case '01': //세대주
                                    if(householder !== 0) return {success: false, status:400, err:`${new Error('이미 승인 받은 세대주 있음')}`};

                                    return await UserDoorMapper.homeRegister(data)
                                    .then((apt) => {
                                        apt.apt_no = data.apt_no;
                                        apt.apc_no = data.apc_no;
                                        return {success: true, status:200, data:apt};
                                    });

                                case '02': //세대원
                                    if(householder !== 1) return {success: false, status:400, err:`${new Error('세대주로 신청 바랍니다.')}`};
                                    return await UserDoorMapper.homeRegister(data)
                                    .then((apt) => {
                                        apt.apt_no = data.apt_no;
                                        apt.apc_no = data.apc_no;
                                        return {success: true, status:200, data:apt};
                                    });

                                default:
                                    return {success: false, status:400 , err: `${new Error('(user_dv_cd)출입 구분 코드 오류')}`};
                            };

                        }).catch((err)=> {return {success: false, status:400 , err:`${err}`};});

                case '02':// 동 출입
                    data.home_no = "";
                    // 기타 신청인지 파악
                    if(data.user_dv_cd !== '09') return {success: false, status:400 , err: `${new Error('(user_dv_cd)출입 구분 코드 오류')}`};
                    // 중복신청 확인
                    if(await UserDoorMapper.duplicate(data) != 0) return {success: false, status:400, err:`${new Error('이미 신청하셨습니다.')}`};

                    data.home_no = "";
                    return await UserDoorMapper.homeRegister(data)
                        .then((apt) => {
                            apt.apt_no = data.apt_no;
                            apt.apc_no = data.apc_no;
                            logger.info(JSON.stringify(apt));
                            return {success: true, status:200, data:apt};
                        });
                    
                case '03':// 단지 출입

                    // 기타 신청인지 파악
                    if(data.user_dv_cd !== '09') return {success: false, status:400 , err: `${new Error('(user_dv_cd)출입 구분 코드 오류')}`};
                    // 중복신청 확인
                    if(await UserDoorMapper.duplicate(data) != 0) return {success: false, status:400, err:`${new Error('이미 신청하셨습니다.')}`};

                    data.bldg_no = "";
                    data.home_no = "";
                    return await UserDoorMapper.homeRegister(data)
                        .then((apt) => {
                            apt.apt_no = data.apt_no;
                            apt.apc_no = data.apc_no;
                            return {success: true, status:200, data:apt};
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