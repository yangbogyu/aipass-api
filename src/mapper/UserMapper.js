"use strict";

const logger = require("../../winton");
const db = require("../config/db");

class UserMapper{

    static async getUserInfo(id){
        return new Promise(async (resolve, reject) =>{
            const query = "SELECT user_mobile, user_psword, salt FROM user_base WHERE id =?;";
            db.query(query, [id],  async(err, data) =>{
                if(err)reject(`${err}`);
                else if(data[0]) resolve(data[0]);
                else resolve({"user_mobile" : null, "user_psword" : null, "salt": null});
            });
        });
    }

    static async save(userInfo){
        return new Promise((resolve, reject) =>{
            const query = `INSERT INTO user_base(
                        user_no, user_mobile, user_psword, salt, user_code, 
                        birth, gender_code, user_name, advertise_agree, push_agree,
                        information_agree, reg_no, modi_no
                        )
                        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
            db.query(query
                , [userInfo.user_no, userInfo.user_mobile, userInfo.user_psword,
                    userInfo.salt, userInfo.user_code, userInfo.birth,
                    userInfo.gender_code, userInfo.user_name,
                    userInfo.advertise_agree, userInfo.push_agree,
                    userInfo.information_agree, userInfo.user_no,
                    userInfo.user_no],  (err) =>{
                if(err) reject(`${err}`);
                else resolve({success : true});
            });
        });
    }

    static async getUserNo(){
        return new Promise((resolve, reject) =>{
            const query = `SELECT ufn_user_no() AS user_no`;
            db.query(query,  (err, data) =>{
                logger.info(data);
                if(err) reject(`${err}`);
                else resolve(data[0]);
            });
        });
    }

}

module.exports = UserMapper;