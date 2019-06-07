"use strict";

let { database } = require("./DataLayer");
let sqlDb;

var sort_by = function(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}

/**
 * Themes available in the inventory
 * List of Themes available in the inventory
 **/
exports.themesGET = function() {
    sqlDb = database;
    //console.log("themeService.js");    
    return sqlDb("theme").orderBy('id_theme')
        .then(data => {
			data.sort((a, b) => parseInt(a.id_theme) - parseInt(b.id_theme));
			return data;
        });
};