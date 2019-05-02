"use strict";

var utils = require("../utils/writer.js");

module.exports.sessionGET = function sessionGET(req, res, next) {
    //console.log("sessionGET");
    var response = []
    
    if(req.session.loggedin) {
        response = req.session.user;
    } 
    utils.writeJson(res, response);
};