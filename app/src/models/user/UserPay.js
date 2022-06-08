"use strict";

const createError = require('http-errors');
const Iamport = require('iamport');
const iamport = new Iamport({
    impKey: process.env.IMP_KEY,
    impSecret: process.env.IMP_SECRET,
  });

const logger = require("../../../winton");
const UserDoorMapper = require('../../mapper/UserDoorMapper');
const UserPayMapper = require('../../mapper/UserPayMapper');
const {getExpirationDate, timestampToString, scheduledDate} = require('../../public/js/dateForm');

class UserPay{
    constructor(body){
        this.body = body;
    }

    async billing(){
        const params = this.body;
        return await iamport.payment.getByMerchant({
            merchant_uid: params.merchant_uid
            })
            .then(async (data) => {
                const apc_data = await UserDoorMapper.getApcData(params.apc_no);
                if(apc_data.user_no !== params.user_no) return new createError(403, new Error('user data Error'));
                const log = {
                    merchant_uid : data.merchant_uid,
                    pay_name: 'AiPass 정기 결제 등록',
                    pay_method: data.pay_method,
                    pay_stat: data.status=='paid' ? 'billing':data.status,
                    pay_date: timestampToString(data.paid_at),
                    reason: params.error_msg ? params.error_msg : null,
                }
                Object.assign(log, apc_data);
                var response = await UserPayMapper.setPaymentLog(log);
                if(params.imp_success == 'false') {
                    return createError(403, new Error(params.error_msg));
                }
                const payment = {
                    customer_uid: data.customer_uid,
                    pay_method: data.pay_method,
                    payment_stat: 'Y',
                    expiration_date: getExpirationDate(),
                }
                Object.assign(payment, apc_data);
                response = await UserPayMapper.setPayment(payment);
                if(response == true) {
                    response = await this.scheduled(apc_data);
                };
                return response

            })
            .catch((err)=> {return err;});
    }


    async scheduled(apc_data, customer_uid){
        const data = this.body;
        const date = scheduledDate();
        // 정기결제 정보
        const schedules = [{
            merchant_uid: 'schedule_'+new Date().getTime(),
            schedule_at: date,
            currency: 'KRW',
            amount: 1100,
            name: 'AiPass 정기결제',
            buyer_name: '정기테스트',//data.user_name,
            buyer_tel: '010-1234-1234',//data.user_mobile,
            notice_url: 'https://api.bogyu98.shop/webhook'
        }];
        return await iamport.subscribe.schedule({
            customer_uid: data.customer_uid? data.customer_uid : customer_uid,
            schedules
        })
        .then(async (data) => {
            data = data[0];
            logger.info(JSON.stringify(data));
            const log = {
                merchant_uid : data.merchant_uid,
                pay_name: 'AiPass 정기결제',
                pay_stat: data.schedule_status,
                pay_date: timestampToString(data.schedule_at),
                amount: data.amount,
                net_amount: Math.round(data.amount/1.1),
                vat: Math.round(data.amount-(data.amount/1.1))
            }
            Object.assign(log, apc_data);
            const response = await UserPayMapper.setPaymentLog(log);
            return {success:response, status:200, data}
        })
        .catch((err)=>{
            logger.error(err);
            return err
        }
        );
    }

    async webhook(){
        const data = this.body;

        return await UserPayMapper.getPaymentLog(data.merchant_uid, 'scheduled')
        .then(async (apc_data) =>{
            if(apc_data.user_no) {
                const payInfo = {
                    user_no: apc_data.user_no,
                    pay_stat: data.status,
                    merchant_uid: data.merchant_uid,
                    
                }
                const customer_uid = await UserPayMapper.getCustomerUid(apc_data);
                const payment = {customer_uid}
                switch(data.status){
                    case 'paid':
                        payment.payment_stat = 'Y';
                        payment.expiration_date = getExpirationDate();
                        break;
                    case 'failed':
                    case 'cancelled':
                        payment.payment_stat = 'N';
                        payment.expiration_date = new Date().toISOString().split("T")[0];
                        break;
                    case 'ready':
                        return {success:true, status:200, data};
                    default :
                        return {success:true, status:400, data};
                }
                Object.assign(payment, apc_data);
                return await UserPayMapper.PaymentLogUpdate(payInfo)
                .then(async(bool) => {
                    return await UserPayMapper.setPayment(payment)
                    .then(async() =>{
                        return payment.payment_stat == 'N'?
                        {success:true, status:200, data} : await this.scheduled(apc_data, customer_uid)});
                })
            } else {
                return createError(400, new Error('DB 정보없음'));
            }
        })
        .catch((err) => {
            logger.error(err);
            return createError(400, new Error('DB 정보없음'));
        })
            
    }

    async getCustomerUid(){
        return {success:true, status:200, data: new Date().getTime().toString(36)};
    }
}

module.exports = UserPay;
