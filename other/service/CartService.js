'use strict';
var fs = require("fs");

let { database } = require('./DataLayer');
let sqlDb;

/**
 * View the content of the cart
 *
 * userId integer 
 * returns Cart
 **/
exports.getCartById = function(userId) {
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

	return isInDb(sqlDb, book).then( inDb =>{
		if(inDb){
			return isInCart(sqlDb, userId, book).then( inCart =>{
				if(inCart){
					return updateBookQty(sqlDb, userId, book)
						.then(result => {
							//console.log("Result", result);	
							//updateJson(userId, book);

							res = {res: 'Book <' + book.title.substring(0, 10) + '>, quantity updated.'};
							return res;
						})
						.catch(function(e) {
							console.error('knex update error', e);
						});

				}else{
					return insertNewBook(sqlDb, userId, book)
						.then(result => {
							//console.log("Result", result);	
							//appendToJson(userId, book);

							res = {res: 'Book <' + book.title.substring(0, 10) + '> insert in the cart.'};
							return res;
						})
						.catch(function(e) {
							console.error('knex insert error', e);
						});
				}
			});
		}else{
			res = {error: 'Book not in the inventory.'};
			return res;
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
	var res = {};
	
	return isInDb(sqlDb, book).then( inDb =>{
		if(inDb){
			return isInCart(sqlDb, userId, book).then( inCart =>{
				if(inCart){
					return updateBookQty(sqlDb, userId, book)
						.then(result => {
							//console.log("Result", result);	
							//updateJson(userId, book);

							res = {res: ('Book <' + book.title.substring(0, 10) + '>, quantity updated.')};
							return res;
						})
						.catch(function(e) {
							console.error('knex update error', e);
						});
				}
			});
		}else{
			res = {error: 'Book not in the inventory.'};
			return res;
		}
	});
}

/**
 * Delete a books in the cart
 *
 * userId integer
 * bookId integer
 **/
exports.deleteBookById = function(userId, bookList) {
	sqlDb = database;
	var res = {};
	var promises = [];
	
	for(var x = 0; x < bookList.length; x++){
		promises.push(deleteBook(sqlDb, userId, bookList[x]));
	}
	//deleteBookJson(userId, bookList);
	
	return Promise.all(promises)    
		.then(function(data){
			res = {res: 'Books deleted from cart.'};
			return res;
		}).catch(function(err){
			console.error('knex update error', err);
		});
}

// -------------- AUXILIARY FUNCTIONS ---------------

function isInDb(sqlDb, book){
    return sqlDb('book')
		.where({'book.id_book': book.Id_book, 'book.title' : book.title})
		.then(data =>{
        	return (data[0]) ? true : false;
    	});
}

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
			var qty = book.quantity || (parseInt(result[0].quantity, 10) + 1);
			
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
			for (var x = 0; x < obj.length; x++){
				// look for the entry with a matching `code` value
			  	if (obj[x].id_user == userId && obj[x].id_book == book.Id_book && obj[x].support == book.support){
					var qty = obj[x].quantity + 1
					obj[x].quantity = book.quantity || qty;
				}
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

function deleteBookJson(userId, bookList){
	
    fs.readFile('other/data_json/cart.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
			var obj = JSON.parse(data); //now it is an object
			for(var x = 0; x < bookList.length; x++){
				for (var i = 0; i < obj.length; i++){
					// look for the entry with a matching `code` value
					if (obj[i] && obj[i].id_user == userId && obj[i].id_book == bookList[x].Id_book && obj[i].support == bookList[x].support){
						obj.splice(i, 1);
						break;
					}
				}
			}
			var json = JSON.stringify(obj);
			fs.writeFile('other/data_json/cart.json', json, 'utf8', function readFileCallback(err){}); // write it back 
    	}
	});
}


