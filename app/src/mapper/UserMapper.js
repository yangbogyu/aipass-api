"use strict";

const logger = require("../../winton");
const db = require("../config/db");

class UserMapper{

    /**
     * 로그인
     * @param {String} user_mobile 
     * @returns userInfo
     */
    static async getUserInfo(user_mobile){
        return new Promise(async (resolve, reject) =>{
            const query = `SELECT user_no, user_mobile, user_name,
                        user_psword, salt, user_code
                        FROM user_base WHERE user_mobile =?;`;
            db.query(query, [user_mobile],  async(err, data) =>{
                if(err)reject(`${err}`);
                else if(data[0]) resolve(data[0]);
                else resolve({"user_mobile" : null, "user_psword" : null, "salt": null});
            });
        });
    }

    /**
     * 회원가입
     * @param {Object} userInfo 
     * @returns response
     */
    static async save(userInfo){
        return new Promise((resolve, reject) =>{
            const query = `INSERT INTO user_base(
                        user_no, user_mobile, user_psword, salt, user_code, 
                        birth, gender_code, user_name, advertise_agree, push_agree,
                        information_agree, reg_no, modi_no
                        )
                        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
            const param = [userInfo.user_no, userInfo.user_mobile,
                userInfo.user_psword, userInfo.salt, userInfo.user_code,
                userInfo.birth, userInfo.gender_code, userInfo.user_name,
                userInfo.advertise_agree, userInfo.push_agree,
                userInfo.information_agree, userInfo.user_no, userInfo.user_no]
            db.query(query, param, (err) =>{
                if(err) reject(`${err}`);
                else resolve({success : true,
                    response : { user_no:userInfo.user_no,
                            user_mobile:userInfo.user_mobile,
                            user_name:userInfo.user_name,
                            user_code:userInfo.user_code
                        },
                    });
            });
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
        });
    }

    /**
     * 회원정보 수정
     * @param {Object} userInfo 
     * @returns response
     */
    static async update(userInfo){
        return new Promise((resolve, reject) =>{
            const query = `UPDATE user_base
                        SET user_name = ?, user_psword = ?,
                        salt = ?, push_agree = ?, advertise_agree = ?,
                        modi_date = NOW(), modi_no = ?
                        WHERE user_mobile = ?;`;
            const param = [userInfo.user_name, userInfo.user_psword,
                userInfo.salt, userInfo.push_agree, userInfo.advertise_agree,
                userInfo.user_no, userInfo.user_mobile]
            db.query(query, param, (err) =>{
                if(err) reject(`${err}`);
                else resolve({success: true});
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
            const query = `UPDATE user_base
                        SET user_name = '삭제', user_psword = '',
                        salt = '', modi_date = NOW(), modi_no =?,
                        user_mobile =?
                        WHERE user_mobile =?;`;
            const param = [userInfo.user_no,
                userInfo.user_mobile,
                userInfo.user_mobile];
            db.query(query, param, (err) =>{
                if(err) reject(`${err}`);
                else resolve({success: true});
            });
        });
    }

}

module.exports = UserMapper;