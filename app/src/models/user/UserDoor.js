"use strict";

const createError = require('http-errors');
const UserDoorMapper = require("../../mapper/UserDoorMapper");

const crypto = require('../../public/js/user/crypto');
const logger = require("../../../winton");
const {isEmpty} = require('../../public/js/inputRegular');
const UserPay = require('./UserPay');

class UserDoor{
    constructor(body){
        this.body = body;
    }

    async homeRegister(){
        const data = this.body;
        try{
            data.apc_no = await UserDoorMapper.getApcNo();
            if(isEmpty(data.apc_dv_cd) || isEmpty(data.user_dv_cd) || isEmpty(data.user_no)){ 
                return createError(400, new Error('데이터 오류.'));
            }
            
            switch (data.apc_dv_cd){ // 신청 구분 코드(B010)
                case '01':// 호 출입
                    if(isEmpty(data.bldg_no) || isEmpty(data.home_no)) {
                        return createError(400, new Error('데이터 오류.'));
                    }
                    return await UserDoorMapper.checkHome(data)
                        .then(async (home) => {
                            if(await UserDoorMapper.duplicate(data) != 0) return createError(400, new Error('이미 신청하셨습니다.'));
                            switch (data.user_dv_cd){ //출입 구분 코드(B011)
                                case '01': //세대주
                                    if(home) return createError(400, new Error('이미 신청한 세대주가 있습니다.'));
                                    return await UserDoorMapper.AptContractType(data.apt_no)
                                    .then(async (apt) => {
                                        // 아파트 타입에 따른 광고정보
                                        if(apt.contract_type == '120' || apt.contract_type == '130' || apt.contract_type == '140'){
                                            data.advertise_yn ='N';
                                        } else if(apt.contract_type == '150' || apt.contract_type == '160'){
                                            if(apt.total_pay_yn == 'Y') data.advertise_yn ='N';
                                            else data.advertise_yn ='Y';
                                        } else {
                                            data.advertise_yn ='Y';
                                        }
                                        return await UserDoorMapper.homeRegister(data)
                                        .then(async() => {
                                            const apt_type = await UserDoorMapper.AptContractType(data.apt_no);
                                            apt_type.apc_no = data.apt_no;
                                            return {success: true, status:200, data:apt_type};
                                        });
                                    })
                                    

                                case '02': //세대원
                                    if(!home) return createError(400, new Error('세대주로 신청 바랍니다.'));
                                    data.householder_apc_no = home.apc_no;
                                    return await UserDoorMapper.homeRegister(data)
                                    .then(async () => {
                                        const apt_type = await UserDoorMapper.AptContractType(data.apt_no);
                                        apt_type.apc_no = data.apt_no;
                                        return {success: true, status:200, data:apt_type};
                                    });

                                default:
                                    return createError(400, new Error('(user_dv_cd)출입 구분 코드 오류'));
                            };

                        })
                        .catch((err)=> {return err;});

                case '02':// 동 출입
                    data.home_no = "";

                    // 기타 신청인지 파악
                    if(data.user_dv_cd !== '09') return createError(400, new Error('(user_dv_cd)출입 구분 코드 오류'));
                    // 중복신청 확인
                    if(await UserDoorMapper.duplicate(data) != 0) return createError(400, new Error('이미 신청하셨습니다.'));

                    return await UserDoorMapper.homeRegister(data)
                        .then(async() => {
                            const apt_type = await UserDoorMapper.AptContractType(data.apt_no);
                            apt_type.apc_no = data.apc_no;
                            return {success: true, status:200, data:apt_type};
                        });
                    
                case '03':// 단지 출입
                    data.bldg_no = "";
                    data.home_no = "";

                    // 기타 신청인지 파악
                    if(data.user_dv_cd !== '09') return createError(400, new Error('(user_dv_cd)출입 구분 코드 오류'));
                    // 중복신청 확인
                    if(await UserDoorMapper.duplicate(data) != 0) return createError(400, new Error('이미 신청하셨습니다.'));

                    return await UserDoorMapper.homeRegister(data)
                        .then(async() => {
                            const apt_type = await UserDoorMapper.AptContractType(data.apt_no);
                            apt_type.apc_no = data.apc_no;
                            return {success: true, status:200, data:apt_type};
                        });

                default:
                    return createError(400, new Error('(apc_dv_cd)출입 구분 코드 오류'));
            };
        }catch(err) {
            return err;
        }
        
    }
    async homeDelete(){
        const data = this.body;
        logger.info(JSON.stringify(data));
        if(data.data.user_no != data.user_no) return createError(401, new Error('인증오류'));
        const pay = new UserPay(data);
        return pay.deletePay()
        .then(async() => {
            logger.error(1)
            return await UserDoorMapper.homeDelete(data).then(()=> {return{success: true, status:200}});
        })
        .catch((err)=> {
            return err;
        });
        

    }
    
}


module.exports = UserDoor;