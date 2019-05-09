const sqlDbFactory = require("knex");
const fs = require('fs');
const _ = require("lodash");

let sqlDB;
let tableLoc = "./other/data_json/";
let relativeTableLoc = "../data_json/";
let tableDB = [];

/* Locally we should launch the app with TEST=true to use SQLlite: > set TEST=true; node ./index.js */
switch (process.env.TEST) {
	case "true":
		console.log("sqlDB: SQLite3" );
		sqlDB = sqlDbFactory({
			client: "sqlite3",
			debug: true, //attivare per stampare query nel log del server
			connection: {
				filename: "./other/storeDB.sqlite"
			},
			useNullAsDefault: true
		});
		break;
	case "gio":
		console.log("sqlDB: PG - Gio" );
		sqlDB = sqlDbFactory({
			debug: false,
			client: "pg",
			connection: {
				host: process.env.DATABASE_URL,
				user: "postgres",
				password: "ciao", 
				database: "postgres"
			},
			ssl: true
		});
		break;
	case "false":
		console.log("sqlDB: PG - Jack" );
		sqlDB = sqlDbFactory({
			debug: false,
			client: "pg",
			connection: {
				host: process.env.DATABASE_URL,
				user: "postgres",
				password: "ZibriJack92", 
				database: "postgres"
			},
			ssl: true
		});
		break;
	default:
		console.log("sqlDB: PG - Heroku" );
		console.log("DB_URL: " + process.env.DATABASE_URL);
    	sqlDB = sqlDbFactory({
			client: "pg",
			connection: process.env.DATABASE_URL,
			ssl: true,
			debug: true
    	});
}

fs.readdirSync(tableLoc).forEach(file => {
  tableDB.push(file.split(".")[0]);
})

//INIT DB IN LOCALE CON SQLITE3 (viene creato un file del db) O IN REMOTO SU HEROKU (PG) (knex permette di astrarre il db)
//AGGIUNGO TUTTE LE TABELLE PRESENTI IN OTHER AL DB, CARICANDOLE DAI JSON, SE NON ESISTONO GIà
function setupDataLayer()
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
module.exports = {setupDataLayer, database: sqlDB};
