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