"use strict";
const logger = require("../../../winton");

module.exports = {
    getExpirationDate(){
        const date = new Date();
        date.setMonth( date.getMonth() + 1 ); 
        date.setDate(1); 
        return date.toISOString().split("T")[0];
    },
    timestampToString(stamp){
        // JavaScript Date타임 스탬프는 밀리 초 단위
        // Unix 타임 스탬프는 초 단위이므로 1000을 곱하여
        // Unix 타임 스탬프를 JavaScript 타임 스탬프로 변환. 
        logger.info(stamp);
        const date = new Date(stamp*1000);
        return date.toISOString();
    },
    scheduledDate(){
        const date = new Date(new Date().getTime());
        date.setMonth(date.getMonth() + 1);
        date.setDate(1);
        return date.getTime()/1000;
    }
    
};