"use strict";

var utils = require("../utils/writer.js");
var CartService = require("../service/CartService.js");

var offset = 0;
var limit = 5;

module.exports.getCartById = function cartCartIdGET(req, res, next) {
	
	req.swagger.params['offset'].value ? offset = req.swagger.params['offset'].value : offset = 0;
  	req.swagger.params['limit'].value ? limit = req.swagger.params['limit'].value : limit = 5;
	
	if (!req.session || !req.session.loggedin) {
    	utils.writeJson(res, { error: "sorry, you must be authorized" }, 401);
  	} else {
    	CartService.getCartById(offset, limit, req.session.user.id_user)
      	.then(function(response) {
        	utils.writeJson(res, response);
      	})
      	.catch(function(response) {
        	utils.writeJson(res, response);
      	});
  	}
};

module.exports.addBookById = function addBookById(req, res, next) {
	
	var book = req.swagger.params['book'].value;
	
	if (!req.session || !req.session.loggedin) {
    	utils.writeJson(res, { error: "sorry, you must be authorized" }, 401);
  	} else {
    	CartService.addBookById(req.session.user.id_user, book)
      	.then(function(response) {
        	utils.writeJson(res, response);
      	})
      	.catch(function(response) {
        	utils.writeJson(res, response);
      	});
  	}
};

module.exports.getCartCountById = function getCartCountById(req, res, next) {
	
	if (!req.session || !req.session.loggedin) {
    	utils.writeJson(res, { error: "sorry, you must be authorized" }, 401);
  	} else {
    	CartService.getCartCountById(req.session.user.id_user)
      	.then(function(response) {
        	utils.writeJson(res, response);
      	})
      	.catch(function(response) {
        	utils.writeJson(res, response);
      	});
  	}
};

module.exports.updateBookQuantity = function updateBookQuantity(req, res, next) {
	
	var book = req.swagger.params['book'].value;
	
	if (!req.session || !req.session.loggedin) {
    	utils.writeJson(res, { error: "sorry, you must be authorized" }, 401);
  	} else {
    	CartService.updateBookQuantity(req.session.user.id_user, book)
      	.then(function(response) {
        	utils.writeJson(res, response);
      	})
      	.catch(function(response) {
        	utils.writeJson(res, response);
      	});
  	}
};

module.exports.deleteBookById = function deleteBookById(req, res, next) {

	var book = req.swagger.params['book'].value;
	
	if (!req.session || !req.session.loggedin) {
    	utils.writeJson(res, { error: "sorry, you must be authorized" }, 401);
  	} else {
    	CartService.deleteBookById(req.session.user.id_user, book)
      	.then(function(response) {
        	utils.writeJson(res, response);
      	})
      	.catch(function(response) {
        	utils.writeJson(res, response);
      	});
  	}
};
