"use strict";

const logger = require("../../winton");
const db = require("../config/db");

class UserMapper{

    /**
     * 로그인
     * @param {String} user_mobile 
     * @returns userInfo
     */
    static async login(user_mobile){
        return new Promise(async (resolve, reject) =>{
            const query = `SELECT user_no, user_mobile, user_name,
                        user_psword, salt, user_code
                        FROM user_base WHERE user_mobile =?;`;
            db.query(query, [user_mobile],  async(err, data) =>{
                if(err)reject(err);
                else if(data[0]) resolve(data[0]);
                else resolve({});
            });
        });
    }

    static async setDevice(userInfo){
        return new Promise(async (resolve, reject) =>{
            const query = `UPDATE user_device
                    SET unique_id =?, push_token= ?, 
                    os= ?, refresh_token= ?, device_data=?
                    WHERE user_mobile =?;`;
            const device = {
                        unique_id: userInfo.unique_id,
                        push_token: userInfo.push_token,
                        model: userInfo.model,
                        os : userInfo.os,
                        os_version: userInfo.os_version,
                        app_version: userInfo.app_version,
                    }
            const param = [userInfo.unique_id, userInfo.push_token,
                    userInfo.os, userInfo.refresh_token,
                    JSON.stringify(device), userInfo.user_mobile];
            db.query(query, param,  async(err) =>{
                if(err)reject(err);
                else resolve({success: true});
            });
        });
    }



    static async getUserInfo(user_no, user_mobile){
        return new Promise(async (resolve, reject) =>{
            const query = `SELECT user_no, user_mobile, user_name, user_code
                        FROM user_base WHERE user_no =? AND user_mobile =?;`;
            const param = [user_no, user_mobile];
            db.query(query, param,  async(err, data) =>{
                if(err)reject(err);
                else if(data[0]) resolve(data[0]);
                else reject({});
            });
        }).catch((err) => {
            return{err:`${err}`};
        });
    }


    /**
     * 회원가입
     * @param {Object} userInfo 
     * @returns response
     */
    static async save(userInfo){
        return new Promise((resolve, reject) =>{
            const query = `INSERT INTO user_base SET ?;
                        INSERT INTO user_device SET ?`

            const device = {
                unique_id: userInfo.unique_id,
                push_token: userInfo.push_token,
                model: userInfo.model,
                os : userInfo.os,
                os_version: userInfo.os_version,
                app_version: userInfo.app_version,
            }
            const param = [ {
                    user_no: userInfo.user_no,
                    user_mobile: userInfo.user_mobile,
                    user_psword: userInfo.user_psword,
                    salt: userInfo.salt,
                    user_code: userInfo.user_code,
                    birth: userInfo.birth,
                    gender_code: userInfo.gender_code,
                    user_name: userInfo.user_name,
                    advertise_agree: userInfo.advertise_agree,
                    push_agree: userInfo.push_agree,
                    information_agree: userInfo.information_agree,
                    reg_no: userInfo.user_no,
                    modi_no: userInfo.user_no,
                },
                {
                    user_no: userInfo.user_no,
                    user_mobile: userInfo.user_mobile,
                    unique_id: userInfo.unique_id,
                    push_token: userInfo.push_token,
                    refresh_token: userInfo.token.refresh_token,
                    os: userInfo.os,
                    device_data: JSON.stringify(device),
                    reg_no: userInfo.user_no,
                    modi_no: userInfo.user_no,
                }
            ];
            db.query(query, param, (err) =>{
                if(err) reject(`${err}`);
                else resolve({ user_no: userInfo.user_no,
                            user_mobile: userInfo.user_mobile,
                            user_name: userInfo.user_name,
                            user_code: userInfo.user_code,
                            token: {
                                access_token: userInfo.token.access_token,
                                refresh_token: userInfo.token.refresh_token
                            }
                        },
                    );
            });
        }).catch((err) => {
            return{err:`${err}`};
        });
    }

    /**
     * 고객번호 생성
     * @returns user_no
     */
    static async getUserNo(){
        return new Promise((resolve, reject) =>{
            const query = `SELECT ufn_user_no() AS user_no`;
            db.query(query,  (err, data) =>{
                if(err) reject(`${err}`);
                else resolve(data[0]);
            });
        }).catch((err) => {
            return{err:`${err}`};
        });
    }

    /**
     * 기존 회원인지 테스트
     * @param {String} user_mobile 
     * @returns use_yn
     */
    static async getUsers(user_mobile){
        return new Promise((resolve, reject) =>{
            const query = `SELECT use_yn FROM user_base
                        WHERE user_mobile =?;`;
            db.query(query, user_mobile, (err, data) =>{
                if(err) reject(err);
                else if(data[0]) resolve(data[0]);
                else resolve({"use_yn" : null});
            });
        });
    }

    /**
     * 회원정보 수정
     * @param {Object} userInfo 
     * @returns response
     */
    static async update(userInfo){
        return new Promise((resolve, reject) =>{

            let query = `UPDATE user_base
                        SET modi_date = NOW(), modi_no= ?`;
            let param = [userInfo.user_no];
            // 들어온 key 만 업데이트
            for (const [key, value] of Object.entries(userInfo)) {
                if(!(key === 'user_no')){
                    query += `,${key}=?`
                    param.push(value);
                }
            }
            query += `WHERE user_no = ?;`;
            param.push(userInfo.user_no);
            logger.info("query ==> "+query);
            logger.info("param ==> "+param);
            db.query(query, param, (err) =>{
                if(err) reject(err);
                else resolve(true);
            });
        });
    }

    /**
     * 회원탈퇴
     * @param {Object} userInfo 
     * @returns response
     */
    static async delete(userInfo){
        return new Promise((resolve, reject) =>{
            const query = `DELETE FROM user_base 
                        WHERE user_no =?
                        AND user_mobile =?;`;
            const param = [userInfo.user_no,
                userInfo.user_mobile];
            db.query(query, param, (err) =>{
                if(err) reject(err);
                else resolve(true);
            });
        });
    }

    static async getUserApt(user_no){
        return new Promise((resolve, reject) =>{
            const query = `SELECT apc.apc_no,
                        ufn_code('B011', apc.user_dv_cd) AS user_dv_cd,
                        apc.apv_yn,
                        ufn_get_name(apc.apt_no, 'apt') AS apt_name,
                        ufn_get_name(apc.bldg_no, 'bldg') AS bldg_name,
                        ufn_get_name(apc.home_no, 'home') AS home_name,
                        apc.advertise_yn,
                        apt.contract_type,
                        apc.payment_yn,
                        title_yn
                        FROM user_application AS apc
                        JOIN apt_base AS apt
                            ON apc.apt_no = apt.apt_no
                            AND apt.use_yn = 'Y'
                        WHERE apc.del_yn = 'N'
                        AND apc.user_no = ?
                        ORDER BY apc.title_yn DESC,
                            apc.reg_date;`;

            db.query(query, user_no, (err, data) =>{
                if(err) reject(err);
                else resolve(data);
            });
        });
    }

    static async getUserScan(user_no){
        return new Promise((resolve, reject) =>{
            const query = `SELECT 
                            scan_yn,
                            start_time,
                            end_time,
                            scan_date_yn,
                            JSON_UNQUOTE(JSON_EXTRACT(scan_date, '$.day')) AS scan_date
                        FROM user_scan
                        WHERE user_no =?;`;

            db.query(query, user_no, (err, data) =>{
                if(err) reject(err);
                else resolve(data);
            });
        });
    }

    /**
     * Token 확인
     * @param {JSON} userInfo{user_no, refresh_token} 
     * @returns {String} use_yn
     */
     static async getRefersh(user_no){
        return new Promise((resolve, reject) =>{
            const query = `SELECT unique_id,
                    refresh_token, 
                    base.user_code AS user_code, 
                    base.user_mobile AS user_mobile
                    FROM user_device AS dev
                    JOIN user_base AS base
                        ON dev.user_no = base.user_no
                    WHERE dev.user_no=?`;
            const param = user_no;
            db.query(query, param, (err, data) =>{
                if(err) reject({err});
                else if(data[0]) {
                    resolve(data[0]);
                } else resolve({});
            });
        });
    }

    /**
     * Token 재발급
     * @param {String, String} (user_no, refresh_token)
     * @returns 
     */
     static async setRefersh(user_no, refresh_token){
        return new Promise((resolve, reject) =>{
            const query = `UPDATE user_device
                    SET refresh_token=?, modi_date=NOW(), modi_no=?
                    WHERE user_no=?`;
            const param = [refresh_token, user_no, user_no];
            db.query(query, param, (err) =>{
                if(err) reject(err);
                else resolve({success: true});
            });
        });
    }

}

module.exports = UserMapper;
