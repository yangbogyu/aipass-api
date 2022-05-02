"use strict";

const { data } = require("../../winton");
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
                if(err)reject(new Error(`${err}`));
                else if(data[0]) resolve(data[0]);
                else reject(new Error('데이터 없음'));
            });
        });
    }

    static async getUserInfo(user_no, user_mobile){
        return new Promise(async (resolve, reject) =>{
            const query = `SELECT user_no, user_mobile, user_name, user_code
                        FROM user_base WHERE user_no =? AND user_mobile =?;`;
            const param = [user_no, user_mobile];
            db.query(query, param,  async(err, data) =>{
                if(err)reject(new Error(`${err}`));
                else if(data[0]) resolve(data[0]);
                else reject(new Error(`데이터 없음`));
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
                device_id: userInfo.device_id,
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
                    device_id: userInfo.device_id,
                    push_token: userInfo.push_token,
                    refersh_token: userInfo.token.refersh_token,
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
                                refersh_token: userInfo.token.refersh_token
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
                if(err) reject(`${err}`);
                else if(data[0]) resolve(data[0]);
                else resolve({"use_yn" : null});
            });
        }).catch((err) => {
            return{err:`${err}`};
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
                if(err) reject(`${err}`);
                else resolve({success: true, status: 200});
            });
        }).catch((err) => {
            return{err:`${err}`};
        });
    }

    /**
     * 회원탈퇴
     * @param {Object} userInfo 
     * @returns response
     */
    static async delete(userInfo){
        return new Promise((resolve, reject) =>{
            const query = `UPDATE user_base
                        SET user_name = '삭제', user_psword = '',
                        salt = '', modi_date = NOW(), modi_no =?,
                        user_mobile =?, use_yn = 'N', del_yn = 'Y'
                        WHERE user_mobile =?;`;
            const param = [userInfo.user_no,
                userInfo.user_mobile,
                userInfo.user_mobile];
            db.query(query, param, (err) =>{
                if(err) reject(`${err}`);
                else resolve({success: true, status: 200});
            });
        }).catch((err) => {
            return{err:`${err}`};
        });
    }


    /**
     * Token 확인
     * @param {String} userInfo{user_no, refersh_token} 
     * @returns use_yn
     */
     static async getRefersh(user_no){
        return new Promise((resolve, reject) =>{
            const query = `SELECT device_id, refersh_token FROM user_device
                WHERE user_no=?`;
            const param = user_no;
            db.query(query, param, (err, data) =>{
                if(err) reject(`${err}`);
                else if(data[0]) {
                    resolve(data[0]);
                } else resolve({err: 'refersh_token 없습니다.'});
            });
        }).catch((err) => {
            return{err:err};
        });
    }

    /**
     * Token 재발급
     * @param {String, String} (user_no, refersh_token)
     * @returns 
     */
     static async setRefersh(user_no, refersh_token){
        return new Promise((resolve, reject) =>{
            const query = `UPDATE user_device
                SET refersh_token=?, modi_date=NOW(), modi_no=?
                WHERE user_no=?`;
            const param = [refersh_token, user_no, user_no];
            db.query(query, param, (err) =>{
                if(err) reject(`${err}`);
                else resolve({success: true});
            });
        }).catch((err) => {
            return{err:`${err}`};
        });
    }

}

module.exports = UserMapper;
