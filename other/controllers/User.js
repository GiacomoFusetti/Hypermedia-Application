"use strict";

var utils = require("../utils/writer.js");
var UserService = require("../service/UserService");


module.exports.userGET = function userGET(req, res, next) {
    var response = []
    
    if(req.session.loggedin) 
        response = req.session.user;
    else
		response = {error: 'User not found'};
	utils.writeJson(res, response, 200);
    
};

module.exports.userLoginPOST = function userLoginPOST(req, res, next) {
    var email = req.swagger.params["email"].value;
    var password = req.swagger.params["password"].value;
    
    UserService.userLoginPOST(email, password).then(function(response) {
        if(response.length==0) {
            utils.writeJson(res, response, 404);
        } else {
            if(!req.session.loggedin) {
                req.session.loggedin = true;
                req.session.user = response[0];
                req.sessionOptions.maxAge = req.session.maxAge || req.sessionOptions.maxAge
                //console.log(req.session.user.id_user);
		response = {ok: 'User ' + response.name + ' succesfully logged in.'};
            }
            utils.writeJson(res, response);
        }
    }).catch(function(response) {
        utils.writeJson(res, response);
    });
};

module.exports.userRegisterPOST = function userRegisterPOST(req, res, next) {
    var body = req.swagger.params["body"].value;
    
    UserService.userRegisterPOST(body).then(function(response) {
        utils.writeJson(res, response);
    }).catch(function(response) {
        utils.writeJson(res, response);
    });
};

module.exports.userLogoutDELETE = function userLogoutDELETE(req, res, next) {
    req.session = null;
    
    utils.writeJson(res, []);
};
