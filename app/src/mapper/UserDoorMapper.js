"use strict";

const logger = require("../../winton");
const db = require("../config/db");

class UserDoorMapper{

    /**
     * 
     * @param {신청 정보} data 
     * @returns {세대주승인인원, 중복신청 체크}
     */
    static async checkHome(data){
        try{
            return new Promise(async (resolve, reject) =>{
                const query = `SELECT COUNT(*) AS COUNT
                        FROM user_application
                        WHERE apv_yn = 'Y'
                        AND del_yn = 'N'
                        AND apt_no = ?
                        AND bldg_no = ?
                        AND home_no = ?
                        AND apc_dv_cd = '01';

                        SELECT COUNT(*) AS COUNT
                        FROM user_application
                        WHERE user_no = ?
                        AND apt_no = ?
                        AND bldg_no = ?
                        AND home_no = ?`;
                const param = [data.apt_no, data.bldg_no, data.home_no, data.user_no, data.apt_no, data.bldg_no, data.home_no];
                
                db.query(query, param,  async(err, data) =>{
                    if(err)reject(new Error(`${err}`));
                    else {
                        logger.info(data[1][0].COUNT);
                        resolve({householder: data[0][0].COUNT, duplicate: data[1][0].COUNT});
                    }
                });
            });
        } catch(err){
            return {err:`${err}`}
        }
    }

    /**
     * 
     * @param {신청 정보} data 
     * @returns 아파트 결제 타입
     */
    static async homeRegister(data){
        try{
            return new Promise(async (resolve, reject) =>{
                const query = `INSERT INTO user_application SET ?;
                            SELECT total_pay_yn, contract_type
                            FROM apt_base
                            WHERE apt_no = ?
                            AND use_yn = 'Y'`;
                const param = {
                    apc_no: data.apc_no,
                    apc_dv_cd: data.apc_dv_cd,
                    user_dv_cd: data.user_dv_cd,
                    user_no: data.user_no,
                    apc_date: data.apc_date,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    apt_no: data.apt_no,
                    bldg_no: data.bldg_no,
                    home_no: data.home_no,
                    reg_no: data.user_no,
                    modi_no: data.user_no,
                };

                db.query(query, [param, data.apt_no],  async(err, data) =>{
                    logger.info(JSON.stringify(data[1]));
                    if(err)reject(new Error(`${err}`));
                    else resolve(data[1][0]);
                });
            });
        } catch(err){
            return {err:`${err}`}
        }
    }

    static async aptRegister(data){
        try{
            return new Promise(async (resolve, reject) =>{
                const query = `INSERT INTO user_application SET ?;`;
                const param = {
                    apc_no: data.apc_no,
                    apc_dv_cd: data.apc_dv_cd,
                    user_dv_cd: data.user_dv_cd,
                    user_no: data.user_no,
                    apc_date: data.apc_date,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    apt_no: data.apt_no,
                    reg_no: data.user_no,
                    modi_no: data.user_no,
                };

                db.query(query, [param, data.apt_no],  async(err) =>{
                    if(err)reject(new Error(`${err}`));
                    else resolve(true);
                });
            });
        } catch(err){
            return {err:`${err}`}
        }
    }
    /**
     * 신청번호 생성
     * @returns 신청번호
     */
    static async getApcNo(){
        return new Promise((resolve, reject) =>{
            const query = `SELECT ufn_apc_no() AS apc_no`;
            db.query(query,  (err, data) =>{
                if(err) reject(`${err}`);
                else resolve(data[0].apc_no);
            });
        }).catch((err) => {
            return{err:`${err}`};
        });
    }
}

module.exports = UserDoorMapper;
