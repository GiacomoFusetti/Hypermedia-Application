"use strict";

let { database } = require("./DataLayer");
let sqlDb;

/**
 * Books available in the inventory
 * List of books available in the inventory
 *
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.genresGET = function(offset, limit) {
    sqlDb = database;
    console.log("genreService.js");    
    return sqlDb("genre")
        .limit(limit)
        .offset(offset)
        .then(data => {
          return data.map(e => {
            return e;
          });
        });
};