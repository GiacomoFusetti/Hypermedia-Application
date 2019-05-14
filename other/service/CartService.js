'use strict';

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

}

/**
 * Add a book in the cart
 *
 * userId integer
 * book Book
 **/
exports.addBookById = function(userId, book) {
	console.log(userId);

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

}

/**
 * Delete a books in the cart
 *
 * userId integer
 * bookId integer
 **/
exports.deleteBookById = function(userId, bookId) {

}

// -------------- AUXILIARY FUNCTIONS ---------------

function isInDb(sqlDb, userId, book){
    return sqlDb('user').count('* as count').where({email: email}).then(data =>{
        return (data[0].count > 0) ? true : false;
    });
}

function insertNewBook(sqlDb, body){
    return sqlDb('user').insert({name: body.name, email: body.email, password: body.password}).then(data =>{
        appendToJson(body);
        return true;
    });
}

function appendToJson(body){
    fs.readFile('other/data_json/cart.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
			var obj = JSON.parse(data); //now it an object
			var id_user = obj.length + 1;
			obj.push({id_user: id_user, name: body.name, email: body.email, password: body.password }); //add data
			var json = JSON.stringify(obj); //convert it back to json
			fs.writeFile('other/data_json/cart.json', json, 'utf8', function readFileCallback(err){}); // write it back 
    	}
	});
}


