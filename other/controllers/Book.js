'use strict';

var utils = require('../utils/writer.js');
var BookService = require('../service/BookService.js');

var offset = 0;
var limit = 0;

var idgenre;
var idtheme;
var rating;

module.exports.booksGET = function booksGET (req, res, next) {
	
  	req.swagger.params['offset'].value ? offset = req.swagger.params['offset'].value : offset = 0;
  	req.swagger.params['limit'].value ? limit = req.swagger.params['limit'].value : limit = 20;
	
	req.swagger.params['genre'].value ? idgenre = req.swagger.params['genre'].value : idgenre = undefined;
	req.swagger.params['theme'].value ? idtheme = req.swagger.params['theme'].value : idtheme = undefined;
	req.swagger.params['rating'].value ? rating = req.swagger.params['rating'].value : rating = undefined;
	
  	BookService.booksGET(offset, limit, idgenre, idtheme, rating)
	.then(function (response) {
  		utils.writeJson(res, response);
	})
	.catch(function (response) {
	  	utils.writeJson(res, response);
	});
};

module.exports.getBookById = function getBookById (req, res, next) {
  var bookId = req.swagger.params['bookId'].value;
  Book.getBookById(bookId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
