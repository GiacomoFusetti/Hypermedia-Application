'use strict';

var utils = require('../utils/writer.js');
var GenreService = require('../service/GenreService');

module.exports.genresGET = function genresGET (req, res, next) {
    console.log("genresGET");
    var offset = 0;
    var limit = 0;
    req.swagger.params['offset'].value ? offset = req.swagger.params['offset'].value : offset = 0;
    req.swagger.params['limit'].value ? limit = req.swagger.params['limit'].value : limit = 20;
    GenreService.genresGET(offset,limit)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

