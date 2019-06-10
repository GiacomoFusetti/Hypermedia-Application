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
exports.booksGET = function(offset, limit, genre, theme, rating, filter, search, format) {
	sqlDb = database;
	let results = {};
	var fields = ['book.id_book', 'book.title', 'book.price_paper', 'book.price_ebook', 'book.cover_img', 'book.support', 'book.rating', 'book.best_seller', 'book.our_favorite', 'book.interview' ];
	
	var query = sqlDb('book')
				.innerJoin('book_author', {'book.id_book' :  'book_author.id_book'})
				.innerJoin('author', {'book_author.id_author' : 'author.id_author'})
				.select(['book.id_book', 'book.title', 'book.price_paper', 'book.price_ebook', 'book.cover_img', 'book.support', 'book.rating', 'book.best_seller', 'book.our_favorite', 'book.interview',
						sqlDb.raw('ARRAY_AGG(author.name) as auth_names'),
						sqlDb.raw('ARRAY_AGG(author.id_author) as auth_ids')])
				.limit(limit)
				.offset(offset)
				.groupBy(fields)
				.orderBy('book.title', 'desc');
	
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
    if(format){
		var vrs;
		switch(format){
			case 1:
				vrs = 'paper';
				break;
			case 2:
				vrs = 'eBook';
				break;
			default:
				return;
		}
		query.whereRaw('(support = ? OR support = \'both\')', [vrs])
	}
    if(search)
        query.where('book.title', 'ilike', '%' + search + '%');
	
	return query.then(data => {
		return data.map(e => {
			return e;
	  	});
	});
};

/**
* Get number of books in db
**/
exports.getBooksCount = function(genre, theme, rating, filter, search, format){
	sqlDb = database;
	
	var query = sqlDb('book').count('*');
	
	if(theme) 
		query.innerJoin('book_theme', {'book.id_book' :  'book_theme.id_book'})
			.innerJoin('theme', {'book_theme.id_theme' : 'theme.id_theme'})
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
    if(format){
		var vrs;
		switch(format){
			case 1:
				vrs = 'paper';
				break;
			case 2:
				vrs = 'eBook';
				break;
			default:
				return;
		}
		query.whereRaw('(support = ? OR support = \'both\')', [vrs])
	}
    if(search)
        query.where('book.title', 'ilike', '%' + search + '%');
    
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
exports.getBookById = function(offset, limit, bookId) {
	sqlDb = database;
	
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
                            .innerJoin('review', {'book.id_book' : 'review.id_book'})
                            .where('book.id_book', bookId)
                            .select('review.*').then(result => {
                                results['review']=result;
						        return sqlDb.from('book')
                                //join with Theme
                                .innerJoin('book_theme', {'book.id_book' :  'book_theme.id_book'})
                                .innerJoin('theme', {'book_theme.id_theme' : 'theme.id_theme'})
                                .where('book.id_book', bookId)
                                .select('theme.theme_name', 'theme.id_theme').then(result => {
                                    results['themes']=result;
                                    return sqlDb.from('book')
                                        //join with Event
                                        .innerJoin('event', {'book.id_book' : 'event.id_book'})
                                        .where('book.id_book', bookId)
                                        .select('event.*').then(result => {
                                            results['event']=result;
                                            return sqlDb.from('book')
                                            //join with SimilarBooks
                                            .innerJoin('book_similarBook', {'book.id_book' :  'book_similarBook.id_book'})
                                            .innerJoin('book as book2', {'book2.id_book' : 'book_similarBook.id_similarBook'})
                                            //join with Author
                                            .innerJoin('book_author', {'book2.id_book' :  'book_author.id_book'})
                                            .innerJoin('author as author2', {'book_author.id_author' : 'author2.id_author'})
                                            .where('book_similarBook.id_book', bookId)
                                            .distinct('book2.id_book', 'book2.title', 'book2.price_paper', 'book2.price_ebook', 'book2.cover_img', 'book2.support', 'book2.best_seller', 'book2.interview')
                                            .select(sqlDb.raw('ARRAY_AGG( author2.name) AS auth_names'), sqlDb.raw('ARRAY_AGG( author2.id_author) AS auth_ids'))
                                            .groupBy('book2.id_book', 'book2.title', 'book2.price_paper', 'book2.price_ebook', 'book2.cover_img', 'book2.support', 'book2.best_seller', 'book2.interview')
                                            .orderBy('book2.id_book')
                                            .limit(limit)
                                            .offset(offset).then(result => {
                                                results['similar_books']=result;
                                                return results;
                                                });
                                           });
									});
							});
					});
			});
    });
	
}

/**
 * Find related book by ID
 * Returns a set of books
 *
 * bookId Long ID of book to return
 * returns Book
 * the relation between books is give by the themes
 **/
exports.getRelatedBooksById = function(offset, limit, bookId) {
	sqlDb = database;
	
	let results = {};
	
	return sqlDb.from('book')
		//join with SimilarBooks
		.innerJoin('book_similarBook', {'book.id_book' :  'book_similarBook.id_book'})
		.innerJoin('book as book2', {'book2.id_book' : 'book_similarBook.id_similarBook'})
		//join with Theme
		.leftJoin('book_theme', {'book2.id_book' :  'book_theme.id_book'})
		.leftJoin('theme', {'book_theme.id_theme' : 'theme.id_theme'})
		//join with Author
		.innerJoin('book_author', {'book2.id_book' :  'book_author.id_book'})
		.innerJoin('author', {'book_author.id_author' : 'author.id_author'})
		.where('book_similarBook.id_book', bookId)
		.distinct('book2.id_book', 'book2.title', 'book2.price_paper', 'book2.price_ebook', 'book2.cover_img', 'book2.support', 'book2.best_seller')
		.select(sqlDb.raw('ARRAY_AGG(DISTINCT theme.theme_name) as theme_names'))
		.select(sqlDb.raw('ARRAY_AGG(DISTINCT author.name) as auth_names'), sqlDb.raw('ARRAY_AGG(DISTINCT author.id_author) as auth_ids'))
		.groupBy('book2.id_book', 'book2.title', 'book2.price_paper', 'book2.price_ebook', 'book2.cover_img', 'book2.support', 'book2.best_seller')
		.orderBy('book2.id_book')
		.limit(limit)
		.offset(offset)
		.then(result => {
			results['similar_books']=result;
            
			return results;
		});
}

/**
* Get number of related books of a book by ID
**/
exports.getRelatedBooksCountById = function(bookId){
	sqlDb = database;
	
	return sqlDb('book')
		.count('*')
		//join with SimilarBooks
		.innerJoin('book_similarBook', {'book.id_book' :  'book_similarBook.id_book'})
		.innerJoin('book as book2', {'book2.id_book' : 'book_similarBook.id_similarBook'})
		.where('book.id_book', bookId).then(data => {
			return data.map(e => {
				return e;
	  	});
	});
}

/**
* Get list of books sorted by genre
**/
exports.booksByGenreGET = function(offset, limit){
	sqlDb = database;
	
	var subQuery = '(SELECT JSONB_AGG((author.id_author, author.name)) as authors \
					 FROM author \
						INNER JOIN book_author ON book_author.id_author = author.id_author \
						INNER JOIN book as book2 ON book2.id_book = book_author.id_book  \
					 WHERE book.id_book = book2.id_book)';
	
	return sqlDb.from('book')
		//join with Genre
		.innerJoin('genre', {'book.id_genre' : 'genre.id_genre'})
		.distinct('genre.id_genre', 'genre.name')
		.select(sqlDb.raw('JSONB_AGG(DISTINCT(book.id_book, book.title, book.price_paper, book.price_ebook, book.cover_img, book.support, book.best_seller,' + subQuery + ')) as books'))
		.groupBy('genre.name', 'genre.id_genre')
		.orderBy('genre.id_genre', 'genre.name')
		.then(data => {
			return data.map(e => {
				return e;
	  		});
		});
}

/**
* Get list of books sorted by theme
**/
exports.booksByThemeGET = function(offset, limit){
	sqlDb = database;
	
	var subQuery = '(SELECT JSONB_AGG((author.id_author, author.name)) as authors \
					 FROM author \
						INNER JOIN book_author ON book_author.id_author = author.id_author \
						INNER JOIN book as book2 ON book2.id_book = book_author.id_book  \
					 WHERE book.id_book = book2.id_book)';
	
	return sqlDb.from('book')
		//join with Theme
		.innerJoin('book_theme', {'book.id_book' :  'book_theme.id_book'})
		.innerJoin('theme', {'book_theme.id_theme' : 'theme.id_theme'})
		.distinct('theme.id_theme', 'theme.theme_name')
		.select(sqlDb.raw('JSONB_AGG(DISTINCT(book.id_book, book.title, book.price_paper, book.price_ebook, book.cover_img, book.support, book.best_seller,' + subQuery + ' )) as books'))
		.from(sqlDb.raw('book'))
		.groupBy('theme.theme_name', 'theme.id_theme')
		.orderBy('theme.theme_name', 'theme.id_theme')
		.then(data => {
			return data.map(e => {
				return e;
	  		});
		});
}

