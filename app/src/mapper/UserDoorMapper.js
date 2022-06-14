"use strict";

const logger = require("../../winton");
const db = require("../config/db");

class UserDoorMapper{

    /**
     * 
     * @param {신청 정보} data 
     * @returns {세대주승인인원}
     */
    static async checkHome(data){
        try{
            return new Promise(async (resolve, reject) =>{
                const query = `SELECT apc_no
                        FROM user_application
                        WHERE del_yn = 'N'
                        AND apt_no = ?
                        AND bldg_no = ?
                        AND home_no = ?
                        AND apc_dv_cd = '01';`;
                const param = [data.apt_no, data.bldg_no, data.home_no];
                
                db.query(query, param,  async(err, data) =>{
                    if(err)reject(new Error(`${err}`));
                    else resolve(data[0]);
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
        return new Promise(async (resolve, reject) =>{
            const query = `INSERT INTO user_application SET ?;`;
            const param = {
                reg_no: data.user_no,
                modi_no: data.user_no,
            };
            //JSON 객체 param에 추가
            for(const [key, value] of Object.entries(data)){ param[key] = value; }
            
            // 타이틀인지 확인
            if(await this.checkApplication(data.user_no) === 0) param.title_yn = 'Y';
            else param.title_yn = 'N';
            param.apv_yn  = 'Y';
            param.use_yn  = 'Y';
            param.use_yn  = 'Y';
            param.apv_date = new Date().toISOString();
            param.apv_no = 'test';
            db.query(query, param,  async(err, data) =>{
                if(err)reject(new Error(err));
                else resolve(true);
            });
        });
    }

    static async duplicate(data){
        try{
            return new Promise(async (resolve, reject) =>{
                const query = `SELECT COUNT(*) AS COUNT
                        FROM user_application
                        WHERE user_no = ?
                        AND apt_no = ?
                        AND bldg_no = ?
                        AND home_no = ?;`;
                const param = [data.user_no, data.apt_no, data.bldg_no, data.home_no];
                logger.info(param);
                db.query(query, param,  async(err, data) =>{
                    if(err)reject(new Error(`${err}`));
                    else resolve(data[0].COUNT);
                });
            });
        } catch(err){
            return {err:`${err}`};
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

    /**
     * 기존 아파트 확인
     * @param {String} user_no 
     * @returns {Int} count
     */
     static async checkApplication(user_no){
        return new Promise((resolve, reject) =>{
            const query = `SELECT count(*) AS COUNT
                        FROM user_application
                        WHERE user_no=?
                        AND del_yn = 'N'
                        AND title_yn = 'Y'`;
            db.query(query, user_no, (err, data) =>{
                if(err) reject(`${err}`);
                else resolve(data[0].COUNT);
            });
        }).catch((err) => {
            return{err:`${err}`};
        });
    }

    /**
     * 아파트 계약타입 확인
     * @param {String} apt_no 
     * @returns {Int} count
     */
     static async AptContractType(apt_no){
        return new Promise((resolve, reject) =>{
            const query = `SELECT total_pay_yn, contract_type
                    FROM apt_base
                    WHERE apt_no = ?
                    AND use_yn = 'Y'`;
            db.query(query, apt_no, (err, data) =>{
                if(err) reject(err);
                else resolve(data[0]);
            });
        });
    }

    /** 
     * 출입문 신청정보 확인
     * @param {String} apc_no 
     * @returns {Int} count
     */
         static async getApcData(apc_no){
            return new Promise((resolve, reject) =>{
                const query = `SELECT apc_no, user_no, apt_no, bldg_no, home_no
                        FROM user_application
                        WHERE apc_no = ?`;
                db.query(query, apc_no, (err, data) =>{
                    if(err) reject(err);
                    else resolve(data[0]);
                });
            });
        }
}

module.exports = UserDoorMapper;
