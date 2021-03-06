"use strict";
const User = require("../../models/user/User");
const UserDoor = require("../../models/user/UserDoor");
const UserPay = require("../../models/user/UserPay");

const logger = require("../../../winton");
const cookieParser = require('cookie-parser');

const output = {
    login: async(req, res, next) => {
        const user = new User(req.data);
        const response = await user.getUserInfo();

        if(!response.success) next(response);
        else {
            const url = {
                method: "GET",
                path: "/login",
                status: response.status,
            };
            delete response.status;
            return res.status(url.status).json(response);
        }
    },
    apt: async(req, res, next) => {
        const user = new User(req.data);
        
        const response = await user.UserApt();

        if(!response.success) next(response);
        else {
            const url = {
                method: "GET",
                path: "/apt-info",
                status: response.status,
            };
            delete response.status;
            return res.status(url.status).json(response);
        }
    },
    scan: async(req, res, next) => {
        const user = new User(req.data);
        const response = await user.UserScan();

        if(!response.success) next(response);
        else {
            const url = {
                method: "GET",
                path: "/scan-info",
                status: response.status,
            };
            delete response.status;
            return res.status(url.status).json(response);
        }
    },
    advertise: async(req, res) => {
        const user = new User(req.data);
        const response = await user.Advertise();

        if(!response.success) next(response);
        else {
            const url = {
                method: "GET",
                path: "/advertise-info",
                status: response.status
            };
            delete response.status;
            return res.status(url.status).json(response);
        }
    },
    billing: async(req, res, next) => {
        const pay = new UserPay(req.query);
        const response = await pay.billing();
        if(!response.success) next(response);
        else{
            const url = {
                method: "GET",
                path: "/billing",
                status: response.status
            };
            delete response.status;
            return res.status(url.status).json(response);
        }
    },
    CustomerUid: async(req, res) =>{
        req.data.apc_no = req.params.apc_no;
        const Pay = new UserPay(req.data);
        const response = await Pay.getCustomerUid();
        const url = {
            method: "GET",
            path: "/customer-uid/:apc_no",
            status: response.status,
        };
        delete response.status;
        return res.status(url.status).json(response);
    }
};

const postProcess = {
    login: async(req, res, next) =>{
        const user = new User(req.body);
        const url = {
            method: "POST",
            path: "/login",
        };
        const response = await user.login();

        if(!response.success) next(response);
        else {
            const url = {
                method: "POST",
                path: "/login",
                status: response.status,
            };
            delete response.status;
            return res.status(url.status).json(response);
        }
    },

    register: async(req, res, next) => {
        const user = new User(req.body);
        const response = await user.register();
        if(!response.success) next(response);
        else{
            const url = {
                method: "POST",
                path: "/register",
                status: response.status
            };
            delete response.status;
            return res.status(url.status).json(response);
        }
    },

    homeRegister: async(req, res, next) => {
        const door = new UserDoor(req.body);
        const response = await door.homeRegister();
        if(!response.success) next(response);
        else{
            const url = {
                method: "POST",
                path: "/home-register",
                status: response.status
            };
            delete response.status;
            return res.status(url.status).json(response);
        }
    },
    update: async(req, res, next) => {
        req.body.data = req.data;
        const user = new User(req.body);
        const response = await user.update();
        if(!response.success) next(response);
        else{
            const url = {
                method: "POST",
                path: "/update",
                status: response.status
            };
            delete response.status;
            return res.status(url.status).json(response);
        }
    },

};

const deleteProcess = {
    delete: async(req, res, next) => {
        req.body.data = req.data;
        const user = new User(req.body);
        const response = await user.delete();
        if(!response.success) next(response);
        else{
            const url = {
                method: "DELETE",
                path: "/delete",
                status: response.status,
            };
            delete response.status;
            return res.status(url.status).json(response);
        }
    },
    homeDelete: async(req, res, next) => {
        req.body.data = req.data;
        const door = new UserDoor(req.body);
        const response = await door.homeDelete();
        if(!response.success) next(response);
        else{
            const url = {
                method: "DELETE",
                path: "/billing",
                status: response.status,
            };
            delete response.status;
            return res.status(url.status).json(response);
        }
    },
    billing: async(req, res, next) => {
        req.body.data = req.data;
        const pay = new UserPay(req.body);
        const response = await pay.deletePay();
        if(!response.success) next(response);
        else{
            const url = {
                method: "DELETE",
                path: "/billing",
                status: response.status,
            };
            delete response.status;
            return res.status(url.status).json(response);
        }
    },
};



module.exports = {
    output,
    postProcess, 
    deleteProcess,

};
