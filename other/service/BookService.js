"use strict";

let { database } = require("./DataLayer");
let sqlDb;


/**
 * Books available in the inventory
 * List of books available in the inventory
 *
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.booksGET = function(offset, limit, genre, theme, rating) {
	sqlDb = database;
	
	var query = sqlDb.select("book.id_book", "book.title", "book.price_paper", "book.price_eBook", "book.cover_img", "book.support", "book.rating", "author.name", "author.id_author"
						//sqlDb.raw("GROUP_CONCAT(?) as ?", ["author.name", "auth_names"]),
						//sqlDb.raw("GROUP_CONCAT(?) as ?", ["author.id_author", "auth_ids"])
							)
				.from("book")
				.innerJoin("book_author", {"book.id_book" :  "book_author.id_book"})
				.innerJoin("author", {"book_author.id_author" : "author.id_author"})
				.limit(limit)
				.offset(offset);
				//.groupBy("id_book");
	
	if(theme) 
		query.from("book")
			.innerJoin("book_theme", {"book.id_book" :  "book_theme.id_book"})
			.innerJoin("theme", {"book_theme.id_theme" : "theme.id_theme"})
			.select("theme.theme_name")
			.where("theme.id_theme", theme);
	if(rating) query.where("rating", rating);
	if(genre) query.where("id_genre", genre);

	return query.then(data => {
		return data.map(e => {
			return e;
	  	});
	});
};


/**
* Get number of books in db
**/

exports.getBooksCount = function(genre, theme, rating){
	sqlDb = database;
	
	var query = sqlDb("book").count("*");
	
	if(theme) 
		query.from("book")
			.innerJoin("book_theme", {"book.id_book" :  "book_theme.id_book"})
			.innerJoin("theme", {"book_theme.id_theme" : "theme.id_theme"})
			.select("theme.theme_name")
			.where("theme.id_theme", theme);
	if(rating) query.where("rating", rating);
	if(genre) query.where("id_genre", genre);
	
	return query.then(data => {
		return data.map(e => {
			return e;
	  	});
	});
}


/**
 * Find book by ID
 * Returns a book
 *
 * bookId Long ID of book to return
 * returns Book
 **/
exports.getBookById = function(bookId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples["application/json"] = {
      author: "Dino Buzzati",
      price: {
        currency: "eur",
        value: 6.027456183070404e14
      },
      id: 0,
      title: "Il deserto dei tartari",
      status: "available"
    };
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
};
