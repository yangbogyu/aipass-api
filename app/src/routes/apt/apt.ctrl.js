"use strict";
const Apt = require("../../models/apt/Apt");

const logger = require("../../../winton");

const output = {
    apt: async(req, res, next) => {
        const apt = new Apt(req.params.apt_name);
        const response = await apt.getApt();
        if(!response.success) next(response);
        else {
            const url = {
                method: "GET",
                path: "/:apt_name",
                status: response.status,
            };
            delete response.status;
            return res.status(url.status).json(response);
        }
    },
    bldg: async(req, res, next) => {
        const apt = new Apt(req.params.apt_no);
        const response = await apt.bldgArray();
        if(!response.success) next(response);
        else {
            const url = {
                method: "GET",
                path: "/:apt_no",
                status: response.status,
            };
            delete response.status;
            return res.status(url.status).json(response);
        }
    },
    home: async(req, res, next) => {
        const apt = new Apt(req.params.bldg_no);
        const response = await apt.homeArray();
        if(!response.success) next(response);
        else {
            const url = {
                method: "GET",
                path: "/:bldg_no",
                status: response.status,
            };
            delete response.status;
            return res.status(url.status).json(response);
        }
    },
 
};

const postProcess = {


};

const putProcess = {
   
};

const deleteProcess = {
    
};



module.exports = {
    output,
    postProcess,
    putProcess,
    deleteProcess,

};
