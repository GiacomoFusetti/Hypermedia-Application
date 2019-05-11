'use strict';

var utils = require('../utils/writer.js');
var AuthorService = require('../service/AuthorService.js');

var offset = 0;
var limit = 0;

module.exports.authorsGET = function authorsGET (req, res, next) {
    
    var offset = 0;
    var limit = 0;
    
    req.swagger.params['offset'].value ? offset = req.swagger.params['offset'].value : offset = 0;
    req.swagger.params['limit'].value ? limit = req.swagger.params['limit'].value : limit = 20;
    
    AuthorService.authorsGET(offset,limit)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.getAuthorById = function getAuthorById (req, res, next) {
    var authorId = req.swagger.params['Id_author'].value;
    
    AuthorService.getAuthorById(authorId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.getBooksByAuthorId = function getBooksByAuthorId(req, res, next) {
    var authorId = req.swagger.params['Id_author'].value;
    
    req.swagger.params['offset'].value ? offset = req.swagger.params['offset'].value : offset = 0;
    req.swagger.params['limit'].value ? limit = req.swagger.params['limit'].value : limit = 6;
    
    AuthorService.getBooksByAuthorId(offset,limit,authorId)
    .then(function (response) {
        utils.writeJson(res, response);
    })
    .catch(function (response) {
        utils.writeJson(res, response);   
    });
};

module.exports.getAuthorsCount = function getAuthorsCount(req, res, next) {
    
    AuthorService.getAuthorsCount()
        .then(function (response) {
            response = response[0];
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.getCountBooksByAuthorId = function getCountBooksByAuthorId (req, res, next) {
    var authorId = req.swagger.params['Id_author'].value; 
    
    AuthorService.getCountBooksByAuthorId(authorId)
        .then(function (response) {
            response = response[0];
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};