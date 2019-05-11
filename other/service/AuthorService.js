"use strict";

let { database } = require("./DataLayer");
let sqlDb;

/**
 * Authors available in the inventory
 **/
exports.authorsGET = function(offset, limit) {
    sqlDb = database;
    return sqlDb("author")
        .limit(limit)
        .offset(offset)
        .then(data => {
          return data.map(e => {
            return e;
          });
        });
};

/**
 * Find Author by ID
 * Returns an author
 *
 * authorId Long ID of author to return
 * returns Author
 **/
exports.getAuthorById = function(authorId) {
	sqlDb = database;
	 
	return sqlDb("author").where({ id_author: authorId })
        .then(data => {
          return data.map(e => {
            return e;
          });
        });
};

/**
 * Find Written books of an author by his ID
 * return a set of books
 *
 **/
exports.getBooksByAuthorId = function(offset,limit,authorId) {
    sqlDb = database;
    
    var query = sqlDb.select("book.id_book", "book.title", "book.price_paper", "book.price_eBook", "book.cover_img", "book.support", "book.rating", "author.name", "author.id_author")
    
        .from("book")
        .offset(offset)
        .limit(limit)
        .innerJoin("book_author", {"book.id_book" :  "book_author.id_book"})
        .innerJoin("author", {"book_author.id_author" : "author.id_author"})
        .where("book_author.id_author", authorId);
    
    return query.then(data => {
		return data.map(e => {
			return e;
	  	});
	});
}

/**
 * Get number of authors in db
 * return a number
 **/
exports.getAuthorsCount = function(offset,limit) {
	sqlDb = database;
	
	var query = sqlDb("author").count("*");
	
	return query.then(data => {
		return data.map(e => {
			return e;
	  	});
	});   
}

/**
 * Get number of books written by an author in db
 * return a number
 **/
exports.getCountBooksByAuthorId = function(authorId){
	sqlDb = database;
	
	var query = sqlDb("author").count("*");
	         
        query.from("book")
             .innerJoin("book_author", {"book.id_book" :  "book_author.id_book"})
			 .innerJoin("author", {"book_author.id_author" : "author.id_author"})
             .where("book_author.id_author", authorId);
	
	return query.then(data => {
		return data.map(e => {
			return e;
	  	});
	});
}