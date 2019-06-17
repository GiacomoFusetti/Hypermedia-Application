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

    return sqlDb('user')
		.where('email', 'ilike', email)
		.where({password:  password})
		.select('id_user', 'name', 'email').then(data =>{
		if(data.length < 1) return {error: 'Email or password wrong!.'};
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
exports.userRegisterPOST = function(name, email, pass) {
    sqlDb = database;
    
    return isInDb(sqlDb, email).then( inDb =>{
        if(inDb){
            return {error: 'Email already used.'};
        }else{
            return insertNewUser(sqlDb, name, email, pass).then( added =>{
			if(added)
				return {ok: 'User Registered.'};
			return {error: 'User NOT Registered.'};
		});
        }
    });
}

// -------------- AUXILIARY FUNCTIONS ---------------

function isInDb(sqlDb, email){
    return sqlDb('user').count('* as count').where({email: email}).then(data =>{
        return (data[0].count > 0) ? true : false;
    });
}

function insertNewUser(sqlDb, name, email, pass){
	return sqlDb('user').count('* as count').then(data =>{
        var id = parseInt(data[0].count) + 1;
		return sqlDb('user').insert({id_user: id, name: name, email: email, password: pass}).then(data =>{
			//appendToJson(name, email, pass, id);
			return true;
		});
    });
}

function appendToJson(name, email, pass, id){
    fs.readFile('other/data_json/user.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
			var obj = JSON.parse(data); //now it an object
			var id_user = id;
			obj.push({id_user: id_user, name: name, email: email, password: pass }); //add data
			var json = JSON.stringify(obj); //convert it back to json
			fs.writeFile('other/data_json/user.json', json, 'utf8', function readFileCallback(err){}); // write it back 
    	}
	});
}




