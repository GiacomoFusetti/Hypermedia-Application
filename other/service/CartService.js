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


