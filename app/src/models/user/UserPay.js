"use strict";

const createError = require('http-errors');
const Iamport = require('iamport');
const iamport = new Iamport({
    impKey: process.env.IMP_KEY,
    impSecret: process.env.IMP_SECRET,
  });
const logger = require("../../../winton");

class UserPay{
    constructor(body){
        this.body = body;
    }

    async billing(){
        const body = this.body;
        return await iamport.payment.getByMerchant({
            merchant_uid: 'order_1652430505647'
          });
    }
}

module.exports = UserPay;
