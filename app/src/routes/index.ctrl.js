"use strict";

const cookieParser = require('cookie-parser');
const logger = require('../../winton');
const {jwt,verifyAccessToken} = require('../models/jwt');

const output = {
    index: async(req, res) =>{
        
        const data = req.data;
        const response = {
            success : data.err ? false : true,
        }
        if(data.err) response.err = data.err;
        else response.data = req.data;
        logger.info("req=> "+JSON.stringify(response));
        const url = {
            method: "GET",
            path: "/",
            status: data.status,
        };
        return res.status(url.status).json(response);
    },
};

const postProcess = {
    refresh: async(req, res) =>{
        const refreshToken = req.body.refresh_token;
        const data = await jwt.setAccessToken(refreshToken);
        const response = {
            success : data.err ? false : true,
        }
        if(data.err) response.err = data.err;
        else response.data = data.data;
        const url = {
            method: "POST",
            path: "/refresh",
            status: data.status,
        };
        return res.status(url.status).json(response);
    },
};

module.exports = {
    output,
    postProcess,
};