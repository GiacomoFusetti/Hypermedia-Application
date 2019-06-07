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
    return sqlDb("genre").orderBy('id_genre')
        .then(data => {
			data.sort((a, b) => parseInt(a.id_genre) - parseInt(b.id_genre));
          	return data;
        });
};