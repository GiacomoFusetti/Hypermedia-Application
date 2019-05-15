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
	
	return sqlDb('cart').select('*')
		.where('cart.id_user', userId)
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
	console.log(book);

	return isInCart(sqlDb, userId, book).then( inCart =>{
		console.log(inCart);
        if(inCart){
			console.log(updateBookQuantity(sqlDb, userId, book));
			updateJson(userId, book);
            res = {res: 'Book in cart.'};
            return res;
        }else{
            insertNewBook(sqlDb, userId, book);
			
			res = {res: 'Book not in cart.'};
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

}

/**
 * Update a books in the cart
 *
 * userId integer
 * bookId integer
 * book Book
 **/
exports.updateBookById = function(userId, bookId, book) {
	sqlDb = database;

}

/**
 * Delete a books in the cart
 *
 * userId integer
 * bookId integer
 **/
exports.deleteBookById = function(userId, bookId) {
	sqlDb = database;

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
    return sqlDb('cart').insert({id_user: userId, id_book: book.Id_book, support: book.support, title: book.title, cover_img: book.cover_img, price: book.price, quantity: 1 }).then(data =>{
        appendToJson(userId, book);
        return true;
    });
}

function updateBookQuantity(sqlDb, userId, book){
	
	return sqlDb('cart')
		.where({'cart.id_user': userId, 'cart.id_book' : book.Id_book, 'cart.support' : book.support})
		.increment('quantity', 1)
		.returning(true);
}

function appendToJson(userId, book){
	
    fs.readFile('other/data_json/cart.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
			var obj = JSON.parse(data); //now it an object
			obj.push({id_user: userId, id_book: book.Id_book, support: book.support, title: book.title, cover_img: book.cover_img, price: book.price, quantity: 1 }); //add data
			var json = JSON.stringify(obj); //convert it back to json
			fs.writeFile('other/data_json/cart.json', json, 'utf8', function readFileCallback(err){}); // write it back 
    	}
	});
}

function updateJson(userId, book){
	
    fs.readFile('other/data_json/cart.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
			var obj = JSON.parse(data); //now it an object
			
			for (var i = 0; i < obj.length; i++){
				// look for the entry with a matching `code` value
			  	if (obj[i].id_user == userId && obj[i].id_book == book.Id_book && obj[i].support == book.support){
					obj[i].quantity += 1;
					console.log(obj[i]);
			  	}
			}
			var json = JSON.stringify(obj);
			fs.writeFile('other/data_json/cart.json', json, 'utf8', function readFileCallback(err){}); // write it back 
    	}
	});
}


