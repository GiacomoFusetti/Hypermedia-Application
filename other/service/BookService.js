'use strict';

let { database } = require('./DataLayer');
let sqlDb;


/**
 * Books available in the inventory
 * List of books available in the inventory
 *
 * offset Integer Pagination offset. Default is 0. (optional)
 * limit Integer Maximum number of items per page. Default is 20 and cannot exceed 500. (optional)
 * returns List
 **/
exports.booksGET = function(offset, limit, genre, theme, rating, filter) {
	sqlDb = database;
	let results = {};
	var fields = ['book.id_book', 'book.title', 'book.price_paper', 'book.price_eBook', 'book.cover_img', 'book.support', 'book.rating' ];
	
	var query = sqlDb('book')
				.innerJoin('book_author', {'book.id_book' :  'book_author.id_book'})
				.innerJoin('author', {'book_author.id_author' : 'author.id_author'})
				.select(['book.id_book', 'book.title', 'book.price_paper', 'book.price_eBook', 'book.cover_img', 'book.support', 'book.rating',
						sqlDb.raw('ARRAY_AGG(author.name) as auth_names'),
						sqlDb.raw('ARRAY_AGG(author.id_author) as auth_ids')])
				.limit(limit)
				.offset(offset)
				.groupBy(fields)
				.orderBy('book.title');
	
	if(theme) 
		query.from('book')
			.innerJoin('book_theme', {'book.id_book' :  'book_theme.id_book'})
			.innerJoin('theme', {'book_theme.id_theme' : 'theme.id_theme'})
			.select('theme.theme_name')
			.where('theme.id_theme', theme)
			.groupBy('theme.theme_name');
	if(rating) query.where('rating', rating);
	if(genre) query.where('id_genre', genre);
	if(filter){
		var flt;
		switch(filter){
			case 1:
				flt = 'best_seller';
				break;
			case 2:
				flt = 'our_favorite';
				break;
			default:
				return;
		}
		query.where(flt, 'true');
	}

	return query.then(data => {
		return data.map(e => {
			return e;
	  	});
	});
};


/**
* Get number of books in db
**/
exports.getBooksCount = function(genre, theme, rating, filter){
	sqlDb = database;
	
	var query = sqlDb('book').count('*');
	
	if(theme) 
		query.from('book')
			.innerJoin('book_theme', {'book.id_book' :  'book_theme.id_book'})
			.innerJoin('theme', {'book_theme.id_theme' : 'theme.id_theme'})
			.select('theme.theme_name')
			.where('theme.id_theme', theme);
	if(rating) query.where('rating', rating);
	if(genre) query.where('id_genre', genre);
	if(filter){
		var flt;
		switch(filter){
			case 1:
				flt = 'best_seller';
				break;
			case 2:
				flt = 'our_favorite';
				break;
			default:
				return;
		}
		query.where(flt, 'true');
	} 
	
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
	sqlDb = database;
	
	/*var fields = ['book.id_book', 'book.description', 'book.pages', 'book.our_favorite', 'book.best_seller', 'book.title', 'book.price_paper', 'book.price_eBook', 'book.cover_img', 'book.support', 'book.rating'];
	 
	var query = sqlDb('book')
		//join with Author
		.innerJoin('book_author', {'book.id_book' :  'book_author.id_book'})
		.innerJoin('author', {'book_author.id_author' : 'author.id_author'})
		//join with Genre
		.innerJoin('genre', {'book.id_genre' : 'genre.id_genre'})
		//join with Theme
		.innerJoin('book_theme', {'book.id_book' :  'book_theme.id_book'})
		.innerJoin('theme', {'book_theme.id_theme' : 'theme.id_theme'})
		//join with Event
		.leftJoin('event', {'book.id_book' : 'event.id_book'})
		.select(['book.id_book', 'book.description', 'book.pages', 'book.our_favorite', 'book.best_seller', 'book.title', 'book.price_paper', 'book.price_eBook', 'book.cover_img', 'book.support', 'book.rating',
				sqlDb.raw('ARRAY_AGG(DISTINCT author.name) as auth_names'),
				sqlDb.raw('ARRAY_AGG(DISTINCT author.id_author) as auth_ids'),
				sqlDb.raw('ARRAY_AGG(DISTINCT genre.name) as genre_name'),
				sqlDb.raw('ARRAY_AGG(DISTINCT genre.id_genre) as genre_id'), 
				sqlDb.raw('ARRAY_AGG(DISTINCT theme.theme_name) as theme_names'),
				sqlDb.raw('ARRAY_AGG(DISTINCT theme.id_theme) as theme_ids'),
				sqlDb.raw('json_agg(DISTINCT event) as event')])

		.where('book.id_book', bookId)
		.groupBy(fields);
	
	return query.then(data => {
		return data.map(e => {
			return e;
	  	});
	});*/
	
	let results = {};
	
	return sqlDb.from('book').select('*').where('book.id_book', bookId).then(result => {
		results['book']=result[0];
		return sqlDb.from('book')
			//join with Author
			.innerJoin('book_author', {'book.id_book' :  'book_author.id_book'})
			.innerJoin('author', {'book_author.id_author' : 'author.id_author'})
			.where('book.id_book', bookId)
			.select('author.name', 'author.id_author').then(result => {
				results['authors']=result;
				return sqlDb.from('book')
					//join with Genre
					.innerJoin('genre', {'book.id_genre' : 'genre.id_genre'})
					.where('book.id_book', bookId)
					.select('genre.name', 'genre.id_genre').then(result => {
						results['genre']=result;
						return sqlDb.from('book')
							//join with Theme
							.innerJoin('book_theme', {'book.id_book' :  'book_theme.id_book'})
							.innerJoin('theme', {'book_theme.id_theme' : 'theme.id_theme'})
							.where('book.id_book', bookId)
							.select('theme.theme_name', 'theme.id_theme').then(result => {
								results['themes']=result;
								return sqlDb.from('book')
									//join with Event
									.leftJoin('event', {'book.id_book' : 'event.id_book'})
									.where('book.id_book', bookId)
									.select('event.*').then(result => {
										results['event']=result;
										return results;
									});
							});
					});
			});
    });
	
};
