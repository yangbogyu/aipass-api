"use strict";
const User = require("../../models/user/User");

const logger = require("../../../winton");
const cookieParser = require('cookie-parser');

const output = {
    login: async(req, res) => {
        const user = new User(req.data);
        const response = await user.getUserInfo(req.data);
        const url = {
            method: "GET",
            path: "/login",
            status: response.status,
        };
        delete response.status;
        return res.status(url.status).json(response);
    },
 
};

const postProcess = {
    login: async(req, res) =>{
        const user = new User(req.body);
        const response = await user.login();
        const url = {
            method: "POST",
            path: "/login",
            status: response.status,
        };
        delete response.status;
        return res.status(url.status).json(response);
    },

    register: async(req, res) => {
        const user = new User(req.body);
        const response = await user.register();
        
        const url = {
            method: "POST",
            path: "/register",
            status: response.status
        };
        delete response.status;
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
            status: response.status
        };
        delete response.status;
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
            status: response.status,
        };
        delete response.status;
        return res.status(url.status).json(response);
    },
};



module.exports = {
    output,
    postProcess,
    putProcess,
    deleteProcess,

};
