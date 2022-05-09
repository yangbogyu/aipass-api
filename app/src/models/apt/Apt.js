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
        .then(function(data){
            return {success: true, status:200 , data:data};
        })
        .catch(function(err){
            return {success: false, status:400 , err:`${err}`};
        });
    }
    
}


module.exports = Apt;