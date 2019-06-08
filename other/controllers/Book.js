'use strict';

var utils = require('../utils/writer.js');
var BookService = require('../service/BookService.js');

var offset = 0;
var limit = 0;

var idgenre;
var idtheme;
var rating;
var filter;
var format;

module.exports.booksGET = function booksGET (req, res, next) {
    var search = '';
    
  	req.swagger.params['offset'].value ? offset = req.swagger.params['offset'].value : offset = 0;
  	req.swagger.params['limit'].value ? limit = req.swagger.params['limit'].value : limit = 20;
	
	req.swagger.params['genre'].value ? idgenre = req.swagger.params['genre'].value : idgenre = undefined;
	req.swagger.params['theme'].value ? idtheme = req.swagger.params['theme'].value : idtheme = undefined;
	req.swagger.params['rating'].value ? rating = req.swagger.params['rating'].value : rating = undefined;
	req.swagger.params['filter'].value ? filter = req.swagger.params['filter'].value : filter = undefined;
    req.swagger.params['format'].value ? format = req.swagger.params['format'].value : format = undefined;
    req.swagger.params['search'].value ? search = req.swagger.params['search'].value : search = undefined;
	
  	BookService.booksGET(offset, limit, idgenre, idtheme, rating, filter, search, format)
	.then(function (response) {
  		utils.writeJson(res, response, 200);
	})
	.catch(function (response) {
	  	utils.writeJson(res, response);
	});
};

module.exports.getBooksCount = function getBooksCount (req, res, next) {
	var search = '';
    
	req.swagger.params['genre'].value ? idgenre = req.swagger.params['genre'].value : idgenre = undefined;
	req.swagger.params['theme'].value ? idtheme = req.swagger.params['theme'].value : idtheme = undefined;
	req.swagger.params['rating'].value ? rating = req.swagger.params['rating'].value : rating = undefined;
	req.swagger.params['filter'].value ? filter = req.swagger.params['filter'].value : filter = undefined;
    req.swagger.params['format'].value ? format = req.swagger.params['format'].value : format = undefined;
    req.swagger.params['search'].value ? search = req.swagger.params['search'].value : search = undefined;
    
  	BookService.getBooksCount(idgenre, idtheme, rating, filter, search, format)
	.then(function (response) {
	  response = response[0];
	  utils.writeJson(res, response);
	})
	.catch(function (response) {
	  utils.writeJson(res, response);
	});
};

module.exports.getBookById = function getBookById (req, res, next) {
	
	req.swagger.params['offset'].value ? offset = req.swagger.params['offset'].value : offset = 0;
  	req.swagger.params['limit'].value ? limit = req.swagger.params['limit'].value : limit = 6;
	
  	var bookId = req.swagger.params['Id_book'].value;
	
  	BookService.getBookById(offset, limit, bookId)
	.then(function (response) {
	  	utils.writeJson(res, response);
	})
	.catch(function (response) {
	  	utils.writeJson(res, response);
	});
};

module.exports.getRelatedBooksById = function getRelatedBooksById (req, res, next) {
	
	req.swagger.params['offset'].value ? offset = req.swagger.params['offset'].value : offset = 0;
  	req.swagger.params['limit'].value ? limit = req.swagger.params['limit'].value : limit = 6;
	
  	var bookId = req.swagger.params['Id_book'].value;
	
  	BookService.getRelatedBooksById(offset, limit, bookId)
	.then(function (response) {
	  	utils.writeJson(res, response);
	})
	.catch(function (response) {
	  	utils.writeJson(res, response);
	});
}

module.exports.getRelatedBooksCountById = function getRelatedBooksCountById (req, res, next) {
	var bookId = req.swagger.params['Id_book'].value;
	
	BookService.getRelatedBooksCountById(bookId)
	.then(function (response) {
		response = response[0];
	  	utils.writeJson(res, response);
	})
	.catch(function (response) {
	  	utils.writeJson(res, response);
	});
}

module.exports.booksByGenreGET = function booksByGenreGET (req, res, next) {
	
	req.swagger.params['offset'].value ? offset = req.swagger.params['offset'].value : offset = 0;
  	req.swagger.params['limit'].value ? limit = req.swagger.params['limit'].value : limit = 6;
	
  	BookService.booksByGenreGET(offset, limit)
	.then(function (response) {
	  	utils.writeJson(res, response);
	})
	.catch(function (response) {
	  	utils.writeJson(res, response);
	});
}

module.exports.booksByThemeGET = function booksByThemeGET (req, res, next) {
	
	req.swagger.params['offset'].value ? offset = req.swagger.params['offset'].value : offset = 0;
  	req.swagger.params['limit'].value ? limit = req.swagger.params['limit'].value : limit = 6;
	
  	BookService.booksByThemeGET(offset, limit)
	.then(function (response) {
	  	utils.writeJson(res, response);
	})
	.catch(function (response) {
	  	utils.writeJson(res, response);
	});
}
