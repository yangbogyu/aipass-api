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
    refresh: async(req, res) =>{
        const response = await jwt.setAccessToken(req);
        const url = {
            method: "POST",
            path: "/refresh",
            status: response.status,
        };
        delete response.status;
        return res.status(url.status).json(response);
    },
};

module.exports = {
    output,
    postProcess,
};