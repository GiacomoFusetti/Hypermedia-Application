"use strict";

var utils = require("../utils/writer.js");
var UserService = require("../service/UserService");
var code = 200;

function isEmail(email){
	var emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;
	return emailExp.test(email)
}


module.exports.userGET = function userGET(req, res, next) {
    var response = []
    
    if(req.session.loggedin) 
        response = req.session.user;
    else
		response = {error: 'No user authenticated'};
	utils.writeJson(res, response, 200);
    
};

module.exports.userLoginPOST = function userLoginPOST(req, res, next) {
    var email = req.swagger.params["email"].value;
    var password = req.swagger.params["password"].value;
	
	if(!isEmail(email)){ 
		utils.writeJson(res, {error: 'Invalid mail.'}, 400);
		return;
	}
    
    UserService.userLoginPOST(email, password).then(function(response) {

		if(!response.error && !req.session.loggedin) {
			req.session.loggedin = true;
			req.session.user = response[0];
			req.sessionOptions.maxAge = req.session.maxAge || req.sessionOptions.maxAge
			response = {ok: 'User ' + req.session.user.name + ' succesfully logged in.'};
		}else if(req.session.loggedin){
			response = {ok: 'User ' + req.session.user.name + ' already logged in.'};
		}

        utils.writeJson(res, response, response.error ? 400 : 200);
        
    }).catch(function(response) {
        utils.writeJson(res, response);
    });
};

module.exports.userRegisterPOST = function userRegisterPOST(req, res, next) {
    var name = req.swagger.params["name"].value;
	var email = req.swagger.params["email"].value;
	var pass = req.swagger.params["password"].value;
	var confpass = req.swagger.params["confirmpassword"].value;
	
	if(!name.trim() || name.length < 4){
		utils.writeJson(res, {error: 'Name must be greater than 4 chars and not empty.'}, 400);
		return;
	}
	if(!isEmail(email)){ 
		utils.writeJson(res, {error: 'Invalid mail.'}, 400);
		return;
	}
	if(pass != confpass || pass.length < 4){ 
		utils.writeJson(res, {error: 'Passwords must be greater than 4 chars and not empty.'}, 400);
		return;
	}
	
	UserService.userRegisterPOST(name, email, pass).then(function(response) {
		utils.writeJson(res, response, response.error ? 400 : 200);
	}).catch(function(response) {
		utils.writeJson(res, response);
	});

};

module.exports.userLogoutDELETE = function userLogoutDELETE(req, res, next) {
	var response = {};
	if(req.session.loggedin){
		response = {ok: 'User ' + req.session.user.name + ' logged out.'};
		req.session = null;
	}else
		response = {ok: 'No user Connected'};
    
    utils.writeJson(res, response, 200);
};
