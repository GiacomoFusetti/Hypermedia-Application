"use strict";
var fs = require("fs");

let { database } = require("./DataLayer");
let sqlDb;

/**
 * Login
 * Login with a form
 *
 * username String 
 * password String 
 * no response value expected for this operation
 **/
exports.userLoginPOST = function(email, password) {
    sqlDb = database;
    console.log("UserService - LoginPOST");

    return sqlDb('user').where({email: email, password:  password}).select('*').then(data =>{
        return data.map(e => {
            return e;
        });
    });
}


/**
 * Register
 * Register into the store
 *
 * body User 
 * no response value expected for this operation
 **/
exports.userRegisterPOST = function(body) {
    sqlDb = database;
    console.log("UserService - RegisterPOST");
    
    return isInDb(sqlDb, body.email).then( inDb =>{
        if(inDb){
            var obj = {error: 'Email already used.'};
            return obj;
        }else{
            insertNewUser(sqlDb, body);
            return sqlDb('user').where({email: body.email}).select('*').then(data =>{
                return data.map(e => {
                    return e;
                });
            });
        }
    });
}

function isInDb(sqlDb, email){
    return sqlDb('user').count('* as count').where({email: email}).then(data =>{
        return (data[0].count > 0) ? true : false;
    });
}

function insertNewUser(sqlDb, body){
    return sqlDb('user').insert({name: body.name, email: body.email, password: body.password}).then(data =>{
        appendToJson(body);
        return true;
    });
}

function appendToJson(body){
    fs.readFile('other/data_json/user.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        var obj = JSON.parse(data); //now it an object
        var id_user = obj.length + 1;
        obj.push({id_user: id_user, name: body.name, email: body.email, password: body.password }); //add data
        var json = JSON.stringify(obj); //convert it back to json
        fs.writeFile('other/data_json/user.json', json, 'utf8', function readFileCallback(err){}); // write it back 
    }});
}




