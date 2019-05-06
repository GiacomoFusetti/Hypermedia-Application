"use strict";

let { database } = require("./DataLayer");
let sqlDb;

/**
 * Faq available in the inventory
 **/
exports.faqGET = function() {
    sqlDb = database;
    console.log("faqService.js");    
    return sqlDb("faq")
        .then(data => {
          return data.map(e => {
            return e;
          });
        });
};