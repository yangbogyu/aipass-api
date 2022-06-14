"use strict";

const cookieParser = require('cookie-parser');
const logger = require('../../winton');
const {jwt,verifyAccessToken} = require('../models/jwt');
const pay = require('../models/user/UserPay');

const output = {
    index: async(req, res) =>{
        
        const data = req.data;
        const response = {
            success : data.err ? false : true,
        }
        if(data.err) response.err = data.err;
        else response.data = req.data;
        const url = {
            method: "GET",
            path: "/",
            status: data.status,
        };
        delete data.status;
        return res.status(url.status).json(response);
    },
};

const postProcess = {
    refresh: async(req, res, next) =>{
        const response = await jwt.setAccessToken(req);
        if(!response.success) next(response);
        else {
            const url = {
                method: "POST",
                path: "/refresh",
                status: response.status,
            };
            delete response.status;
            return res.status(url.status).json(response);
        } 
    },
    webhook: async(req, res, next) =>{
        const Pay = new pay(req.body);
        const response = await Pay.webhook();
        if(!response.success) next(response);
        else {
            const url = {
                method: "POST",
                path: "/webhook",
                status: response.status,
            };
            delete response.status;
            return res.status(url.status).json(response);
        }
    },
    test: async(req, res) =>{
        const date = new Date();
        date.setMonth( date.getMonth() + 1 ); 
        date.setDate(1);
        return res.status(200).json({date : date.toISOString().split("T")[0]});
    },
};

module.exports = {
    output,
    postProcess,
};