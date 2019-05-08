"use strict";

let { database } = require("./DataLayer");
let sqlDb;

/**
 * Genres available in the inventory
 * List of Genres available in the inventory
 **/
exports.genresGET = function() {
    sqlDb = database;
    //console.log("genreService.js");    
    return sqlDb("genre")
        .then(data => {
          return data.map(e => {
            return e;
          });
        });
};