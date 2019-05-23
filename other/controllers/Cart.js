"use strict";

var utils = require("../utils/writer.js");
var CartService = require("../service/CartService.js");


module.exports.getCartById = function cartCartIdGET(req, res, next) {
	
	if (!req.session || !req.session.loggedin) {
    	utils.writeJson(res, { error: "sorry, you must be authorized" }, 401);
  	} else {
    	CartService.getCartById(req.session.user.id_user)
      	.then(function(response) {
        	utils.writeJson(res, response);
      	})
      	.catch(function(response) {
        	utils.writeJson(res, response);
      	});
  	}
};

module.exports.addBookById = function addBookById(req, res, next) {
	
	var book = req.swagger.params["body"].value;
	
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
	
	var book = req.swagger.params['body'].value;
	
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
	
	var bookList = req.swagger.params['body'].value;
	
	if (!req.session || !req.session.loggedin) {
		utils.writeJson(res, { error: "sorry, you must be authorized" }, 401);
  	} else {
    	CartService.deleteBookById(req.session.user.id_user, bookList)
      	.then(function(response) {
        	utils.writeJson(res, response);
      	})
      	.catch(function(response) {
        	utils.writeJson(res, response);
      	});
  	}
};
