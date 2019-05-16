'use strict';
var fs = require("fs");

let { database } = require('./DataLayer');
let sqlDb;

/**
 * View the content of the cart
 *
 * userId integer 
 * offset integer, limit integer
 * returns Cart
 **/
exports.getCartById = function(offset, limit, userId) {
	sqlDb = database;
	
	return sqlDb.from('cart')
		.where('cart.id_user', userId)
		//join with Book
		.innerJoin('book', {'book.id_book' :  'cart.id_book'})
		//join with Author
		.innerJoin('book_author', {'book.id_book' :  'book_author.id_book'})
		.innerJoin('author', {'book_author.id_author' : 'author.id_author'})
		.select('cart.*')
		.select(sqlDb.raw('ARRAY_AGG(DISTINCT author.name) as auth_names'), sqlDb.raw('ARRAY_AGG(DISTINCT author.id_author) as auth_ids'))
		.groupBy('cart.id_user', 'cart.id_user', 'cart.id_book', 'cart.support', 'cart.quantity', 'cart.title', 'cart.cover_img', 'cart.price')
		.limit(limit)
		.offset(offset)
		.then(data =>{
        	return data.map(e => {
            	return e;
        	});
    	});
}

/**
 * Add a book in the cart
 *
 * userId integer
 * book Book
 **/
exports.addBookById = function(userId, book) {
	sqlDb = database;
	var res = {}

	return isInCart(sqlDb, userId, book).then( inCart =>{
        if(inCart){
			return updateBookQty(sqlDb, userId, book)
				.then(result => {
					//console.log("Result", result);	
					updateJson(userId, book);
			
					res = {res: 'Book ' + book.title.substring(0, 10) + ', quantity updated.'};
					return res;
				})
				.catch(function(e) {
					console.error('knex update error', e);
				});
			
        }else{
            return insertNewBook(sqlDb, userId, book)
				.then(result => {
					//console.log("Result", result);	
					appendToJson(userId, book);

					res = {res: 'Book ' + book.title.substring(0, 10) + ' insert in the cart.'};
					return res;
				})
				.catch(function(e) {
					console.error('knex insert error', e);
				});
        }
    });
}

/**
 * Get the number of books in the cart
 *
 * userId integer
 * return integer
 **/
exports.getCartCountById = function(userId) {
	sqlDb = database;
	
	var total = 0;
	var results = {}
	
	return sqlDb.from('cart')
		.select('cart.quantity')
		.where({'cart.id_user': userId})
		.then(result => {
			var total = 0;
			for(var x = 0; x < result.length; x++)
				total += parseInt(result[x].quantity, 10);

			results['total_count'] = total;
			results['distinct_count'] = result.length; 
			return results;
		});
}

/**
 * Update a books in the cart
 *
 * userId integer
 * bookId integer
 * book Book
 **/
exports.updateBookQuantity = function(userId, book) {
	sqlDb = database;
	
	return isInCart(sqlDb, userId, book).then( inCart =>{
        if(inCart){
			return updateBookQty(sqlDb, userId, book)
				.then(result => {
					console.log("Result", result);	
					updateJson(userId, book);
			
					res = {res: 'Book ' + book.title.substring(0, 10) + ', quantity updated.'};
					return res;
				})
				.catch(function(e) {
					console.error('knex update error', e);
				});
        }
	});
}

/**
 * Delete a books in the cart
 *
 * userId integer
 * bookId integer
 **/
exports.deleteBookById = function(userId, book) {
	sqlDb = database;

	return isInCart(sqlDb, userId, book).then( inCart =>{
        if(inCart){
			return deleteBook(sqlDb, userId, book)
				.then(result => {
					//console.log("Result", result);	
					deleteBookJson(userId, book);
			
					res = {res: 'Book ' + book.title.substring(0, 10) + ' deleted from cart.'};
					return res;
				})
				.catch(function(e) {
					console.error('knex update error', e);
				});
        }else{

        }
    });

}

// -------------- AUXILIARY FUNCTIONS ---------------

function isInCart(sqlDb, userId, book){
    return sqlDb('cart').count('* as count')
		//join with User
		.innerJoin('user', {'user.id_user' :  'cart.id_user'})
		//join with Book
		.innerJoin('book', {'book.id_book' :  'cart.id_book'})
		.where({'cart.id_user': userId, 'cart.id_book' : book.Id_book, 'cart.support' : book.support})
		.then(data =>{
        	return (data[0].count > 0) ? true : false;
    	});
}

function insertNewBook(sqlDb, userId, book){
    return sqlDb('cart')
		.insert({id_user: userId, id_book: book.Id_book, support: book.support, title: book.title, cover_img: book.cover_img, price: book.price, quantity: 1 });
}

function updateBookQty(sqlDb, userId, book){

	return sqlDb.table('cart').select('cart.quantity').where({'cart.id_user': userId, 'cart.id_book' : book.Id_book, 'cart.support' : book.support})
		.then(result => {
			var qty = parseInt(result[0].quantity, 10) + 1;
			
			if (qty > 0){
				return sqlDb.table('cart')
					.where({'cart.id_user': userId, 'cart.id_book' : book.Id_book, 'cart.support' : book.support})
					.update({quantity: qty})
					.returning('*');
			}else{
				return false;
			}
		});
}

function deleteBook(sqlDb, userId, book){

	return sqlDb.table('cart')
		.where({'cart.id_user': userId, 'cart.id_book' : book.Id_book, 'cart.support' : book.support})
  		.del();
}

function updateJson(userId, book){
	
    fs.readFile('other/data_json/cart.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
			var obj = JSON.parse(data); //now it is an object
			
			for (var i = 0; i < obj.length; i++){
				// look for the entry with a matching `code` value
			  	if (obj[i].id_user == userId && obj[i].id_book == book.Id_book && obj[i].support == book.support)
					obj[i].quantity += 1;
			}
			var json = JSON.stringify(obj);
			fs.writeFile('other/data_json/cart.json', json, 'utf8', function readFileCallback(err){}); // write it back 
    	}
	});
}

function appendToJson(userId, book){
	
    fs.readFile('other/data_json/cart.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
			var obj = JSON.parse(data); //now it is an object
			obj.push({id_user: userId, id_book: book.Id_book, support: book.support, title: book.title, cover_img: book.cover_img, price: book.price, quantity: 1 }); //add data
			var json = JSON.stringify(obj); //convert it back to json
			fs.writeFile('other/data_json/cart.json', json, 'utf8', function readFileCallback(err){}); // write it back 
    	}
	});
}

function deleteBookJson(userId, book){
	
    fs.readFile('other/data_json/cart.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
			var obj = JSON.parse(data); //now it is an object
			
			for (var i = 0; i < obj.length; i++){
				// look for the entry with a matching `code` value
			  	if (obj[i].id_user == userId && obj[i].id_book == book.Id_book && obj[i].support == book.support)
					delete obj[i];
			}
			var json = JSON.stringify(obj);
			fs.writeFile('other/data_json/cart.json', json, 'utf8', function readFileCallback(err){}); // write it back 
    	}
	});
}


