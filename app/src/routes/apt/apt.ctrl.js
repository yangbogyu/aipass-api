"use strict";
const Apt = require("../../models/apt/Apt");

const logger = require("../../../winton");

const output = {
    apt: async(req, res) => {
        const data = req.data;
        const apt = new Apt(req.params.apt_name);
        const response = await apt.getApt();
        const url = {
            method: "GET",
            path: "/:apt_name",
            status: response.status,
        };
        delete response.status;
        return res.status(url.status).json(response);
    }
 
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
