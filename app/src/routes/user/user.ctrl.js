"use strict";
const User = require("../../models/user/User");

const logger = require("../../../winton");
const cookieParser = require('cookie-parser');

const output = {
    login: async(req, res) => {
        const user = new User(req.data);
        const url = {
            method: "GET",
            path: "/login",
        };
        return await user.getUserInfo()
        .then((response)=>{
            if(response.success) url.status = 200;
            else url.status = 401;
            return res.status(url.status).json(response);
        })
        .catch((err)=> {
            logger.error(JSON.stringify(err));
            url.status = 401;
            return res.status(url.status).json(err);
        });
        
    },
 
};

const postProcess = {
    login: async(req, res) =>{
        const user = new User(req.body);
        const url = {
            method: "POST",
            path: "/login",
        };
        return await user.login()
        .then((response) => {
            if(response.success) url.status = 200;
            else url.status = 401;
            return res.status(url.status).json(response);
        })
        .catch((err)=> {
            logger.error(JSON.stringify(err));
            url.status = 401;
            return res.status(url.status).json(err);
        });
        
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
        req.body.data = req.data;
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
        req.body.data = req.data;
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
