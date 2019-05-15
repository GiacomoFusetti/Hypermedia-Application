"use strict";

let { database } = require("./DataLayer");
let sqlDb;

/**
 * Events available in the inventory
 **/
exports.eventsGET = function(offset, limit, orderBy) {
    sqlDb = database;
    
    var query = sqlDb.select('event.id_event','event.name','event.city','event.date_day','event.date_month','event.date_year','event.img').from("event")
        .limit(limit)
        .offset(offset)
        
    switch(orderBy){
        case "latest":
            query.where('event.date_month', '>=', new Date().getMonth() + 1)
                 .where('event.date_year', '>=', new Date().getYear() + 1900)
                 .orderBy([{column : 'event.date_year', order: 'asc'}, {column : 'event.date_month', order: 'asc'}, {column : 'event.date_day', order: 'asc'}]);
            break;  
        case "current_month":
            query.where('event.date_month',new Date().getMonth() + 1)
                 .where('event.date_year',new Date().getYear() + 1900);
        default:
           query.orderBy([{column : 'event.date_year', order: 'desc'}, {column : 'event.date_month', order: 'desc'}, {column : 'event.date_day', order: 'desc'}]);
    }
    
	return query.then(data => {
		return data.map(e => {
			return e;
	  	});
	});
};

/**
 * Find Event by ID
 * Returns the event with with the relatet book
 *
 * eventId Long ID of author to return
 **/
exports.getEventById = function(eventId) {
	sqlDb = database;
    
    let results = {};
    
    return sqlDb.from('event').select('*').where('event.id_event', eventId).then(result => {
        results['event']=result[0];
        return sqlDb.from('event')
            //join with book
            .innerJoin('book', {'event.id_book' : 'book.id_book'})
            .where('event.id_event', eventId)
            .select('book.*').then(result => {
                    results['book']=result[0];
                    return sqlDb.from('event')
                        //join with genre
                        .innerJoin('book', {'event.id_book' : 'book.id_book'})
                        .innerJoin('genre', {'book.id_genre' : 'genre.id_genre'})
                        .where('event.id_event', eventId)
                        .select('genre.id_genre','genre.name').then(result => {
                            results['genre']=result[0];
                            return sqlDb.from('event')
                                //join with theme
                                .innerJoin('book', {'event.id_book' : 'book.id_book'})
                                .innerJoin('book_theme', {'book.id_book' : 'book_theme.id_book'})
                                .innerJoin('theme', {'book_theme.id_theme' : 'theme.id_theme'})
                                .where('event.id_event', eventId)
                                .select('theme.id_theme', 'theme.theme_name').then(result => {
                                    results['themes']=result;
                                    return sqlDb.from('event')
                                        //join with author
                                        .innerJoin('book', {'event.id_book' : 'book.id_book'})
                                        .innerJoin('book_author', {'book.id_book' : 'book_author.id_book'})
                                        .innerJoin('author', {'book_author.id_author' : 'author.id_author'})
                                        .where('event.id_event', eventId)
                                        .select('author.id_author', 'author.name').then(result => {
                                            results['authors']=result;
                                            return results;
                            });
                        });
                    });
                });
            });
};

/**
 * Get number of events in db
 * return a number
 **/
exports.getEventsCount = function(offset,limit,orderBy) {
	sqlDb = database;
    
	var query = sqlDb('event').count('*');
    
    switch(orderBy){
        case "latest":
            query.where('event.date_month', '>=', new Date().getMonth() + 1)
                 .where('event.date_year', '>=', new Date().getYear() + 1900)
            break;  
        case "current_month":
            query.where('event.date_month',new Date().getMonth() + 1)
                 .where('event.date_year',new Date().getYear() + 1900);
        default:
    }
	
	return query.then(data => {
		return data.map(e => {
			return e;
	  	});
	});   
}