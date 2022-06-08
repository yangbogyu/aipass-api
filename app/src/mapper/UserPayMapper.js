"use strict";

const logger = require("../../winton");
const db = require("../config/db");

class UserPayMapper{

    static async setPayment(payment){

        return new Promise(async (resolve, reject) =>{

            const query = `INSERT INTO user_payment SET ?
                        ON DUPLICATE KEY UPDATE ?;`;
            payment.reg_no = payment.user_no;
                        
            db.query(query, [payment, payment],  async(err) =>{
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
                else resolve(data[0].customer_uid);
                
            });
        });
    }
}


module.exports = UserPayMapper;