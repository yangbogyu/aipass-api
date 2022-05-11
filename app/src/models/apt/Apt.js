"use strict";

const AptMapper = require("../../mapper/AptMapper");

const crypto = require('../../public/js/user/crypto');
const logger = require("../../../winton");

class Apt{
    constructor(body){
        this.body = body;
    }

    /**
     * 아파트 정보 불러오기
     * 
     */
    async getApt(){
        const apt_name = this.body;

        return await AptMapper.getApt(apt_name)
        .then((data) => {
            return {success: true, status:200 , data:data};
        })
        .catch((err) => {
            return {success: false, status:400 , err:`${err}`};
        });
    }

    /**
     * 아파트 동정보
     */
    async bldgArray(){
        const apt_no = this.body;
        return await AptMapper.getBldg(apt_no)
        .then((data) => {
            return {success: true, status:200 , data:data};
        })
        .catch((err) => {
            return {success: false, status:400 , err:`${err}`};
        });
    }

    async homeArray(){
        const bldg_no = this.body;
        return await AptMapper.getHome(bldg_no)
        .then(({floor_number, home_number}) => {
            const data = [];
            for(var i=1; i <= floor_number; i++){
                for(var x=1; x<= home_number; x++){
                    if(x >= 10) data.push({home_no: `${i}${x}`, home_name: `${i}${x}호`});
                    else data.push({home_no: `${i}0${x}`, home_name: `${i}0${x}호`});
                }
            }
            return {success: true, status:200 , data:data};
        })
        .catch((err) => {
            return {success: false, status:400 , err:`${err}`};
        });
    }
    
}


module.exports = Apt;