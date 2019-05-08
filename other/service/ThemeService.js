"use strict";

let { database } = require("./DataLayer");
let sqlDb;

/**
 * Themes available in the inventory
 * List of Themes available in the inventory
 **/
exports.themesGET = function() {
    sqlDb = database;
    //console.log("themeService.js");    
    return sqlDb("theme")
        .then(data => {
          return data.map(e => {
            return e;
          });
        });
};