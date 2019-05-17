'use strict';

var utils = require('../utils/writer.js');
var AuthorService = require('../service/AuthorService.js');

var offset = 0;
var limit = 0;

module.exports.authorsGET = function authorsGET (req, res, next) {
    
    var offset = 0;
    var limit = 0;
    var search = '';
    
    req.swagger.params['offset'].value ? offset = req.swagger.params['offset'].value : offset = 0;
    req.swagger.params['limit'].value ? limit = req.swagger.params['limit'].value : limit = 20;
    req.swagger.params['search'].value ? search = req.swagger.params['search'].value : search = undefined;
    
    AuthorService.authorsGET(offset,limit,search)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.getAuthorById = function getAuthorById (req, res, next) {
    var authorId = req.swagger.params['Id_author'].value;
    
    req.swagger.params['offset'].value ? offset = req.swagger.params['offset'].value : offset = 0;
    req.swagger.params['limit'].value ? limit = req.swagger.params['limit'].value : limit = 6;
    
    AuthorService.getAuthorById(offset, limit, authorId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.getWrittenBooksById = function getWrittenBooksById(req, res, next) {
    var authorId = req.swagger.params['Id_author'].value;
    
    req.swagger.params['offset'].value ? offset = req.swagger.params['offset'].value : offset = 0;
    req.swagger.params['limit'].value ? limit = req.swagger.params['limit'].value : limit = 6;
    
    AuthorService.getWrittenBooksById(offset,limit,authorId)
    .then(function (response) {
        utils.writeJson(res, response);
    })
    .catch(function (response) {
        utils.writeJson(res, response);   
    });
};

module.exports.getAuthorsCount = function getAuthorsCount(req, res, next) {
    
    var search = '';
    req.swagger.params['search'].value ? search = req.swagger.params['search'].value : search = undefined;
    
    AuthorService.getAuthorsCount(search)
        .then(function (response) {
            response = response[0];
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.getWrittenBooksCountById = function getWrittenBooksCountById (req, res, next) {
    var authorId = req.swagger.params['Id_author'].value; 
    
    AuthorService.getWrittenBooksCountById(authorId)
        .then(function (response) {
            response = response[0];
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};