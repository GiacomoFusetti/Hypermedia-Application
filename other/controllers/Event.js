'use strict';

var utils = require('../utils/writer.js');
var EventService = require('../service/EventService.js');

var offset = 0;
var limit = 0;

var orderBy; 

module.exports.eventsGET = function eventsGET (req, res, next) {

    req.swagger.params['offset'].value ? offset = req.swagger.params['offset'].value : offset = 0;
    req.swagger.params['limit'].value ? limit = req.swagger.params['limit'].value : limit = 6;
    
    req.swagger.params['orderBy'].value ? orderBy = req.swagger.params['orderBy'].value : orderBy = undefined;
    
    EventService.eventsGET(offset,limit,orderBy)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.getEventById = function getEventById (req, res, next) {
    
    var eventId = req.swagger.params['Id_event'].value;
    
    EventService.getEventById(eventId)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.getEventsCount = function getEventsCount(req, res, next) {
    req.swagger.params['offset'].value ? offset = req.swagger.params['offset'].value : offset = 0;
    req.swagger.params['limit'].value ? limit = req.swagger.params['limit'].value : limit = 6;
    req.swagger.params['orderBy'].value ? orderBy = req.swagger.params['orderBy'].value : orderBy = undefined;
    
    EventService.getEventsCount(offset,limit,orderBy)
        .then(function (response) {
            response = response[0];
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};