"use strict";

let { database } = require("./DataLayer");
let sqlDb;

/**
 * Events available in the inventory
 **/
exports.eventsGET = function(offset, limit) {
    sqlDb = database;
    return sqlDb("event")
        .limit(limit)
        .offset(offset)
        .then(data => {
          return data.map(e => {
            return e;
          });
        });
};