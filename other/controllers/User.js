"use strict";

var utils = require("../utils/writer.js");
var UserService = require("../service/UserService");

module.exports.userLoginPOST = function userLoginPOST(req, res, next) {
    var email = req.swagger.params["email"].value;
    var password = req.swagger.params["password"].value;
    
    UserService.userLoginPOST(email, password).then(function(response) {
        if(response.length==0) {
            res.status(404);
            //res.send({ error: "404", title: "404: File Not Found" });
            utils.writeJson(res, response);
        } else {
            if(!req.session.loggedin) {
                req.session.loggedin = true;
                req.session.user = response[0];
                req.sessionOptions.maxAge = req.session.maxAge || req.sessionOptions.maxAge
                //console.log(req.session.user.id_user);
            }
            utils.writeJson(res, response);
        }
    }).catch(function(response) {
        utils.writeJson(res, response);
    });
};

module.exports.userRegisterPOST = function userRegisterPOST(req, res, next) {
    console.log("userRegisterPOST");
    var body = req.swagger.params["body"].value;
    
    UserService.userRegisterPOST(body).then(function(response) {
        utils.writeJson(res, response);
    }).catch(function(response) {
        utils.writeJson(res, response);
    });
};

module.exports.userLogoutDELETE = function userLogoutDELETE(req, res, next) {
    console.log("userLogoutDELETE");
    
    req.session = null;
    
    utils.writeJson(res, []);
};
