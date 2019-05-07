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
            //console.log("Author e: " + e); 
            return e;
          });
        });
};

exports.getAuthorById = function(){
	
}

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