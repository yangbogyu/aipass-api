"use strict";
const User = require("../../models/user/User");

const logger = require("../../../winton");

const output = {
    home: (req, res) =>{
        logger.info(`GET / 304 "홈 화면 이동"`);
        res.render("home/index");
    },

    login: (req, res) =>{
        logger.info(`GET /login 304 "로그인 화면 이동"`);
        res.render("home/login");
    },
};

const process = {
    login: async(req, res) =>{
        const user = new User(req.body);
        const response = await user.login();
        const url = {
            method: "POST",
            path: "/login",
            status: response.err ? 400 : 200,
        };
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


module.exports = {
    output,
    process,
};
