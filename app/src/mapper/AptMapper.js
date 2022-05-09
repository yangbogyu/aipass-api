"use strict";

const logger = require("../../winton");
const db = require("../config/db");

class AptMapper{

    static async getApt(apt_name){

        try {
            return new Promise(async (resolve, reject) =>{

                apt_name = `%${apt_name}%`;
                const query = `SELECT apt_no,
                            apt_name,
                            ufn_area('01',area_code) AS 'sido',
                            ufn_area('02',area_code) AS 'gugun',
                            address
                            FROM apt_base
                            WHERE use_yn = 'Y'
                            AND apt_name LIKE ?;`;
                db.query(query, apt_name,  async(err,data) =>{
                    if(err){
                        reject(new Error(`${err}`));
                    } else if(data[0]) {
                        resolve(data);
                    } else {
                        resolve([{apt_no: null, apt_name: null, sido:null, gugun:null, address: null}]);
                    }
                });
            });
        }catch(err){
            return new Error(`${err}`);
        }
    }
}


module.exports = AptMapper;