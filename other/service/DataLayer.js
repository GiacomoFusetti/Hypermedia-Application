const sqlDbFactory = require("knex");
const fs = require('fs');
const _ = require("lodash");

let sqlDB;
let tableLoc = "./other/data_json/";
let relativeTableLoc = "../data_json/";
let tableDB = [];

/* Locally we should launch the app with TEST=true to use SQLlite: > set TEST=true; node ./index.js */
if (process.env.TEST){
    sqlDB = sqlDbFactory({
        client: "sqlite3",
        debug: true, //attivare per stampare query nel log del server
        connection: {
            filename: "./other/storeDB.sqlite"
        },
        useNullAsDefault: true
    });
}else{
    sqlDB = sqlDbFactory({
        debug: false,
        client: "pg",
        connection: process.env.DATABASE_URL,
        ssl: true
    });
}

fs.readdirSync(tableLoc).forEach(file => {
  tableDB.push(file.split(".")[0]);
})

//INIT DB IN LOCALE CON SQLITE3 (viene creato un file del db) O IN REMOTO SU HEROKU (PG) (knex permette di astrarre il db)
function initsqlDB()
{
    return initDB();
}
//AGGIUNGO TUTTE LE TABELLE PRESENTI IN OTHER AL DB, CARICANDOLE DAI JSON, SE NON ESISTONO GIà
function initDB()
{
    var tab
    var promises = []
	for(tab in tableDB)
    {   
        if (tableDB[tab] != "")
        {
            promises.push(createDB(tableDB,tab));
        }
    }
    return promises
}

function createDB(tableDB, tab)
{
	var currentTable;
	var attributeCurrentTable = [];
    currentTable = tableDB[tab];
    var json = require(relativeTableLoc + currentTable + ".json");

    for(var attr in json[0] )
        attributeCurrentTable.push(attr);
    return sqlDB.schema.hasTable(currentTable).then(exists => {
        if (!exists) {
          sqlDB.schema
            .createTable(currentTable, table => {
              console.log("Table '" + tableDB[tab] + "' created");
              for(var i in attributeCurrentTable)
                table.string(attributeCurrentTable[i],10000);
            })
            .then(() => {
              return Promise.all(
                _.map(json, p => {
                  return sqlDB(currentTable).insert(p);
                })
              );
            });
        }
    });
}
module.exports = {initsqlDB, database: sqlDB};