'use strict';

var utils = require('../utils/writer.js');
var ThemeService = require('../service/ThemeService.js');

module.exports.themesGET = function themesGET (req, res, next) {
    //console.log("themesGET");
	
    ThemeService.themesGET()
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

