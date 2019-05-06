'use strict';

var utils = require('../utils/writer.js');
var AuthorService = require('../service/AuthorService.js');

module.exports.authorsGET = function authorsGET (req, res, next) {
    console.log("authorsGET");
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

