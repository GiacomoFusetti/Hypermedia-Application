'use strict';

var utils = require('../utils/writer.js');
var EventService = require('../service/EventService.js');

module.exports.eventsGET = function eventsGET (req, res, next) {
    console.log("eventsGET");
    var offset = 0;
    var limit = 0;
    req.swagger.params['offset'].value ? offset = req.swagger.params['offset'].value : offset = 0;
    req.swagger.params['limit'].value ? limit = req.swagger.params['limit'].value : limit = 6;
    EventService.eventsGET(offset,limit)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};