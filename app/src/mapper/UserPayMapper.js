"use strict";

const logger = require("../../winton");
const db = require("../config/db");
class UserPayMapper{

    static async setPayment(payment){

        return new Promise(async (resolve, reject) =>{

            const query = `INSERT INTO user_payment SET ?
                        ON DUPLICATE KEY UPDATE ?;
                        UPDATE user_application
                        SET payment_yn='Y', advertise_yn='N', modi_date = NOW(), modi_no= ?
                        WHERE apc_no= ? OR householder_apc_no= ?;`;
            payment.reg_no = payment.user_no;
            payment.reg_date = new Date().toISOString();
            const params = [payment,payment,payment.user_no, payment.apc_no, payment.apc_no];
            db.query(query, params,  async(err) =>{
                if(err)reject(new Error(err));
                else resolve(true);
            });
        });
    }

    static async setPaymentLog(log){

        return new Promise(async (resolve, reject) =>{
            
            const query = `INSERT INTO user_payment_log SET ?;`;
            log.reg_no = log.user_no;
            log.modi_no = log.modi_no;
                        
            db.query(query, log,  async(err) =>{
                if(err)reject(new Error(err));
                else resolve(true);
            });
        });
    }

    static async getPaymentLog(merchant_uid, pay_stat){

        return new Promise(async (resolve, reject) =>{
            const query = `SELECT user_no, pay_method, apc_no, 
                        apt_no, bldg_no, home_no
                        FROM user_payment_log
                        WHERE merchant_uid = ?
                        AND pay_stat = ?;`;
                        
            db.query(query, [merchant_uid, pay_stat],  async(err, data) =>{
                if(err)reject(new Error(err));
                else resolve(data[0]);
            });
        });
    }

    static async PaymentLogUpdate(payInfo){

        return new Promise(async (resolve, reject) =>{
            
            let query = `UPDATE user_payment_log
                        SET modi_date = NOW(), modi_no= ?`;
            let param = [payInfo.user_no];
            // 들어온 key 만 업데이트
            for (const [key, value] of Object.entries(payInfo)) {
                if(!(key === 'user_no' || key === 'merchant_uid')){
                    query += `,${key}=?`
                    param.push(value);
                }
            }
            query += `WHERE merchant_uid = ?;`;
            param.push(payInfo.merchant_uid);
            db.query(query, param, (err) =>{
                if(err) reject(err);
                else resolve(true);
            });
        });
    }

    static async getCustomerUid(payInfo){
        return new Promise(async (resolve, reject) =>{
            const query = `SELECT customer_uid
                        FROM user_payment
                        WHERE user_no = ?
                        AND apc_no = ?;`;
            const params = [payInfo.user_no, payInfo.apc_no];
            db.query(query, params,  async(err, data) =>{
                if(err) reject(err);
                else resolve(data[0]);
            });
        });
    }

    static async getAmount(apc_data){
        return new Promise(async (resolve, reject) =>{
            const query = `SELECT count(*) as count
                        FROM user_application
                        WHERE householder_apc_no = ?
                        AND apv_yn = 'Y';
                        SELECT apt_amount
                        FROM apt_base
                        WHERE apt_no =?;`;
            db.query(query, [apc_data.apc_no, apc_data.apt_no],  async(err, data) =>{
                if(err) reject(err);
                else resolve({count: (data[0][0].count+1), apt_amount: data[1][0].apt_amount});
            });
        });
    }

    static async userInfo(customer_uid){
        return new Promise(async (resolve, reject) =>{
            const query = `SELECT user_no, user_name, user_mobile
                        FROM user_base
                        WHERE user_no =(SELECT user_no FROM user_payment WHERE customer_uid =?);`;
            db.query(query, customer_uid,  async(err, data) =>{
                if(err) reject(err);
                else resolve(data[0]);
            });
        });
    }

    static async deletePay(payInfo){
        return new Promise(async (resolve, reject) =>{
            await db.beginTransaction();

            const query = `UPDATE user_application
                        SET advertise_yn = 'Y', payment_yn = 'N',
                            modi_date = NOW(), modi_no = ?
                        WHERE apc_no = ?
                        OR householder_apc_no = ?;
                        UPDATE user_payment 
                        SET payment_stat = 'N', pay_method = NULL,
                            expiration_date = NOW(), use_yn = 'N',
                            del_yn = 'Y', del_date = NOW(), del_no = ?
                        WHERE customer_uid = ?;
                        UPDATE user_base
                        SET payment_yn = 'N', payment = NULL, payment_state = NULL
                        WHERE user_no = ?;`;
            const user_application = [payInfo.user_no, payInfo.apc_no, payInfo.apc_no];
            const user_payment = [payInfo.user_no, payInfo.customer_uid];
            const user_base = [payInfo.user_no];
            const params = user_application.concat(user_payment,user_base)
            db.query(query, params,  async(err, data) =>{
                if(err) {
                    logger.info(JSON.stringify(err));
                    db.rollback();
                    reject(err);
                } else {
                    db.commit();
                    resolve(true);
                }
            });
            
        });
    }
}


module.exports = UserPayMapper;