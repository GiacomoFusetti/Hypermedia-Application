"use strict";

let { database } = require("./DataLayer");
let sqlDb;

/**
 * Events available in the inventory
 **/
exports.eventsGET = function(offset, limit, current_month) {
    sqlDb = database;
    
    var query = sqlDb.select('event.id_event','event.name','event.city','event.date_day','event.date_month','event.date_year','event.img').from("event")
        .limit(limit)
        .offset(offset)
        .orderBy([{column : 'event.date_year', order: 'desc'}, {column : 'event.date_month', order: 'desc'}, {column : 'event.date_day', order: 'desc'}]);
    if(current_month)
        query.where('event.date_month',new Date().getMonth() + 1)
             .where('event.date_year',new Date().getYear() + 1900);
    
	return query.then(data => {
		return data.map(e => {
			return e;
	  	});
	});
};

/**
 * Get number of events in db
 * return a number
 **/
exports.getEventsCount = function(offset,limit) {
	sqlDb = database;
	
	var query = sqlDb("event").count("*");
	
	return query.then(data => {
		return data.map(e => {
			return e;
	  	});
	});   
}