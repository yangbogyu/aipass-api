"use strict";
const User = require("../../models/user/User");
const UserDoor = require("../../models/user/UserDoor");

const logger = require("../../../winton");
const cookieParser = require('cookie-parser');

const output = {
    login: async(req, res) => {
        const user = new User(req.data);
        const response = await user.getUserInfo()
        .then((response)=>{
            return response;
        })
        .catch((err)=> {
            return err
        });

        const url = {
            method: "GET",
            path: "/login",
            status: response.status,
        };
        delete response.status;
        return res.status(url.status).json(response);
    },
    apt: async(req, res) => {
        const user = new User(req.data);
        
        const response = await user.UserApt()
        .then((response)=>{
            return response;
        })
        .catch((err)=> {
            return err;
        });
        const url = {
            method: "GET",
            path: "/apt-info",
            status: response.status,
        };
        delete response.status;
        return res.status(url.status).json(response);
    },
    scan: async(req, res) => {
        const user = new User(req.data);
        const response = await user.UserScan()
        .then((response)=>{
            return response;
        })
        .catch((err)=> {
            return err;
        });
        const url = {
            method: "GET",
            path: "/scan-info",
            status: response.status,
        };
        delete response.status;
        return res.status(url.status).json(response);
    },
    advertise: async(req, res) => {
        const user = new User(req.data);
        const url = {
            method: "GET",
            path: "/advertise-info",
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

    homeRegister: async(req, res) => {
        const door = new UserDoor(req.body);
        const response = await door.homeRegister();
        
        const url = {
            method: "POST",
            path: "/home-register",
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
