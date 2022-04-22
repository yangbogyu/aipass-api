"use strict";
const User = require("../../models/user/User");

const logger = require("../../../winton");
const cookieParser = require('cookie-parser');

const output = {

};

const postProcess = {
    login: async(req, res) =>{
        const user = new User(req.body);
        const response = await user.login();
        const url = {
            method: "POST",
            path: "/login",
            status: response.err ? 400 : 200,
        };
        logger.info(response.data.token.refershToken);
        return res.status(url.status).json(response);
    },

    register: async(req, res) => {
        const user = new User(req.body);
        const response = await user.register();
        
        const url = {
            method: "POST",
            path: "/register",
            status: response.err ? 400 : 201,
        };
        return res.status(url.status).json(response);
    },



};

const putProcess = {
    update: async(req, res) => {
        const user = new User(req.body);
        const response = await user.update();
        
        const url = {
            method: "PUT",
            path: "/update",
            status: response.err ? 400 : 201,
        };
        return res.status(url.status).json(response);
    },
};

const deleteProcess = {
    delete: async(req, res) => {
        const user = new User(req.body);
        const response = await user.delete();
        
        const url = {
            method: "DELETE",
            path: "/delete",
            status: response.err ? 400 : 201,
        };
        return res.status(url.status).json(response);
    },
};



module.exports = {
    output,
    postProcess,
    putProcess,
    deleteProcess,

};
