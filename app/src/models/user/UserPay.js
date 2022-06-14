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
        iamport.subscribe.unschedule({
            customer_uid: params.customer_uid
            })
            .then(async ({response}) => {
                if(!response) return;
                for(const item of response){
                    {
                        logger.info(JSON.stringify(item));
                        const data = {
                            merchant_uid: item.merchant_uid,
                            status: 'revoked'
                        };
                        await this.webhook(data);
                    }
                }
            })
        return await iamport.payment.getByMerchant({
            merchant_uid: params.merchant_uid
            })
            .then(async (data) => {
                const apc_data = await UserDoorMapper.getApcData(params.apc_no);
                if(apc_data.user_no !== params.user_no) return new createError(403, new Error('user data Error'));
                const log = {
                    merchant_uid : data.merchant_uid, //주문번호
                    pay_name: 'AiPass 정기 결제 등록', // 
                    pay_method: data.pay_method,    
                    pay_stat: data.status=='paid' ? 'billing':data.status, // 성공여부 
                    pay_date: timestampToString(data.paid_at), //결제일자
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
                    response = await this.scheduled(apc_data, data.customer_uid);
                };
                return response

            })
            .catch((err)=> {return err;});
    }


    async scheduled(apc_data, customer_uid){
        const userInfo = await UserPayMapper.userInfo(customer_uid);
        const date = scheduledDate();
        // 정기결제 정보
        const schedules = [{
            merchant_uid: 'schedule_'+new Date().getTime(),
            schedule_at: date,
            currency: 'KRW',
            amount: await this.getAmount(apc_data),
            name: 'AiPass 정기결제',
            buyer_name: userInfo.user_name,//data.user_name,
            buyer_tel: userInfo.user_mobile,//data.user_mobile,
            notice_url: 'https://api.bogyu98.shop/webhook'
        }];
        return await iamport.subscribe.schedule({
            customer_uid,
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

    async webhook(billing){
        const data = this.body? this.body : billing;

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
        const data = this.body;
        return await UserPayMapper.getCustomerUid(data)
        .then((data) => {
            const response = {success:true, status:200};
            response.customer_uid = data? data.customer_uid : new Date().getTime().toString(36);
            return response;
        })
        .catch((err) => {
            logger.error(err);
            return createError(400, new Error('DB 정보없음'));
        })
    }

    async getAmount(apc_data){
        return await UserPayMapper.getAmount(apc_data)
        .then(({count, apt_amount}) => {
            var amount = apt_amount + (apt_amount/10);
            logger.info(`amount => ${count * amount}`);
            return count * amount;
        });
    }

    async deletePay(){
        const body = this.body;
        
    }
}

module.exports = UserPay;