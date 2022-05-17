"use strict";

const logger = require("../../winton");
const db = require("../config/db");

class AptMapper{

    static async getApt(apt_name){

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
                    reject(err);
                } else if(data[0]) {
                    resolve(data);
                } else {
                    resolve([{}]);
                }
            });
        });
    }

    static async getBldg(apt_no){

        return new Promise(async (resolve, reject) =>{
            const query = `SELECT bldg_no,
                        bldg_name
                        FROM apt_bldg
                        WHERE use_yn = 'Y'
                        AND apt_no =?;`;
            db.query(query, apt_no,  async(err,data) =>{
                if(err){
                    reject({err});
                } else if(data[0]) {
                    resolve(data);
                } else {
                    resolve([{}]);
                }
            });
        });
    }

    static async getHome(bldg_no){

        return new Promise(async (resolve, reject) =>{
            const query = `SELECT floor_number,
                        home_number
                        FROM apt_bldg
                        WHERE use_yn = 'Y'
                        AND bldg_no =?;`;
            db.query(query, bldg_no,  async(err,data) =>{
                if(err){
                    reject({err});
                } else if(data[0]) {
                    resolve(data[0]);
                } else {
                    resolve([{}]);
                }
            });
        });
    }
}


module.exports = AptMapper;