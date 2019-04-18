"use strict";

let sqlDb;

exports.genresDbSetup = function(database) {
  sqlDb = database;
  console.log("Checking if genres table exists");
  return database.schema.hasTable("genres").then(exists => {
    if (!exists) {
      console.log("It doesn't so we create it");
      return database.schema.createTable("genres", table => {
            table.increments("genreId");
            table.text("name");
      });
    }
  });
};