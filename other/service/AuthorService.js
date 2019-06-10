'use strict';

let { database } = require('./DataLayer');
let sqlDb;

/**
 * Authors available in the inventory
 **/
exports.authorsGET = function(offset, limit, search) {
    sqlDb = database;
    
    var query =  sqlDb('author')
            .orderBy('author.name')
            .limit(limit)
            .offset(offset)
    if(search)
        query.where('author.name', 'ilike', '%' + search + '%' )
           
    return query.then(data => {
      return data.map(e => {
        return e;
      });
    });
}

/**
 * Find Author by ID
 * Returns the author with his written books
 *
 * authorId Long ID of author to return
 **/
exports.getAuthorById = function(offset, limit, authorId) {
	sqlDb = database;
    
    let results = {};
    
    return sqlDb.from('author').select('*').where('author.id_author', authorId).then(result => {
        results['author']=result[0];
        return sqlDb.from('author')
            //join with book
            .innerJoin('book_author', {'author.id_author' :  'book_author.id_author'})
            .innerJoin('book', {'book_author.id_book' :  'book.id_book'})
            //join with Author
			.innerJoin('book_author as book_author2', {'book.id_book' :  'book_author2.id_book'})
			.innerJoin('author as author2', {'book_author2.id_author' : 'author2.id_author'})
            .where('author.id_author', authorId)
            .distinct('book.id_book', 'book.title', 'book.price_paper', 'book.price_ebook', 'book.cover_img', 'book.support', 'book.best_seller', 'book.our_favorite') 
			.select(sqlDb.raw('ARRAY_AGG(author2.name) AS auth_names'), sqlDb.raw('ARRAY_AGG(author2.id_author) AS auth_ids'))
            .groupBy('book.id_book', 'book.title', 'book.price_paper', 'book.price_ebook', 'book.cover_img', 'book.support', 'book.best_seller', 'book.our_favorite')
            .offset(offset)
            .limit(limit).then(result => {
                results['books']=result;
                return results;
            });
    });
}

exports.getWrittenBooksById = function(offset, limit, authorId) {
	sqlDb = database;
    
    let results = {};

    return sqlDb.from('author')
        //join with book
        .innerJoin('book_author', {'author.id_author' :  'book_author.id_author'})
        .innerJoin('book', {'book_author.id_book' :  'book.id_book'})
        //join with Author
        .innerJoin('book_author as book_author2', {'book.id_book' :  'book_author2.id_book'})
        .innerJoin('author as author2', {'book_author2.id_author' : 'author2.id_author'})
        .where('author.id_author', authorId)
        .distinct('book.id_book', 'book.title', 'book.price_paper', 'book.price_ebook', 'book.cover_img', 'book.support', 'book.best_seller', 'book.our_favorite') 
        .select(sqlDb.raw('ARRAY_AGG(author2.name) AS auth_names'), sqlDb.raw('ARRAY_AGG(author2.id_author) AS auth_ids'))
        .groupBy('book.id_book', 'book.title', 'book.price_paper', 'book.price_ebook', 'book.cover_img', 'book.support', 'book.best_seller', 'book.our_favorite')
        .offset(offset)
        .limit(limit).then(result => {
            results['books']=result;
            return results;
        });

}

/**
 * Get number of authors in db
 * return a number
 **/
exports.getAuthorsCount = function(search) {
	sqlDb = database;
	
	var query = sqlDb('author').count('*');
    
    if(search)
        query.where('author.name', 'ilike', '%' + search + '%' )
    
	return query.then(data => {
		return data.map(e => {
			return e;
	  	});
	});   
}

/**
 * Get number of books written by an author in db
 * return a number
 **/
exports.getWrittenBooksCountById = function(authorId){
	sqlDb = database;
	
	var query = sqlDb('author').count('*');
	         
        query.from('book')
             .innerJoin('book_author', {'book.id_book' :  'book_author.id_book'})
			 .innerJoin('author', {'book_author.id_author' : 'author.id_author'})
             .where('book_author.id_author', authorId);
	
	return query.then(data => {
		return data.map(e => {
			return e;
	  	});
	});
}