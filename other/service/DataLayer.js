const sqlDbFactory = require("knex");

let { genresDbSetup } = require("./GenreService");
let { booksDbSetup } = require("./BookService");

let sqlDb = sqlDbFactory({
  client: "pg",
  connection: { host: process.env.DATABASE_URL,
               user : 'postgres',
               password : 'ciao',
              database : 'bookstore'},
  ssl: true,
  debug: true
});

function setupDataLayer() {
  console.log("Setting up data layer");
  console.log(process.env.DATABASE_URL);

  console.log(sqlDb.connection.database);
  genresDbSetup(sqlDb).then(() => {
      return booksDbSetup(sqlDb);
  }); 
}

module.exports = { database: sqlDb, setupDataLayer };
