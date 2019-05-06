'use strict';

var utils = require('../utils/writer.js');
var FaqService = require('../service/FaqService.js');

module.exports.faqGET = function faqGET (req, res, next) {
    console.log("faqGET");

    FaqService.faqGET()
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

