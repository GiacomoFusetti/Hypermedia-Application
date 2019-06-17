"use strict";

var fs = require("fs"),
  path = require("path"),
  http = require("http");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const process = require("process");
const _ = require("lodash");

let cookieSession = require("cookie-session");
let cookieParser = require("cookie-parser");
let serveStatic = require("serve-static");

var swaggerTools = require("swagger-tools");
var jsyaml = require("js-yaml");
var serverPort = process.env.PORT || 8080;

let { setupDataLayer } = require("./other/service/DataLayer");

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, "/swagger.json"),
  controllers: path.join(__dirname, "./other/controllers"),
  useStubs: process.env.NODE_ENV === "development" // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname, "./other/api/swagger.yaml"), "utf8");
var swaggerDoc = jsyaml.safeLoad(spec);
if (process.env.NODE_ENV === 'development') {
  	swaggerDoc.host = "localhost:" + serverPort;
	swaggerDoc.schemes = ["http"];
}

// Add cookies to responses
app.use(cookieParser());
app.use(cookieSession({
    name: "bookStoreSession",
    keys: ["k1", "k2"]
    // Cookie Options
    //,maxAge: 5 * 60 * 1000 // 5 minutes
}));

// /BACKEND API Documentation
app.get('/backend/main', function (req, res){
	const fullUrl = swaggerDoc.schemes + '://' + req.get('host') + req.originalUrl;
    res.redirect(fullUrl + '.html');
});
app.get('/backend/spec', function (req, res){
	const fullUrl = swaggerDoc.schemes + '://' + req.get('host');
    res.redirect(fullUrl + '/api-docs');
});
app.get('/backend/spec.yaml', function (req, res){
	const fullUrl = swaggerDoc.schemes + '://' + req.get('host');
    res.redirect(fullUrl + '/api-docs');
});
app.get('/backend/swaggerui', function (req, res){
	const fullUrl = swaggerDoc.schemes + '://' + req.get('host');
    res.redirect(fullUrl + '/docs');
});
app.get('/backend/app.zip', function (req, res){
	res.download('./app.zip');
});

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  app.use(express.static(__dirname + "/public"));

Promise.all(setupDataLayer()).then(() => {
    // Start the server
	// Serve the Swagger documents and Swagger UI
  	//   http://localhost:8080/docs => Swagger UI
 	//   http://localhost:8080/api-docs => Swagger document
    http.createServer(app).listen(serverPort, function() {
      console.log("Your server is listening on port %d (" + swaggerDoc.schemes + "://" + swaggerDoc.host + ")", serverPort);
      console.log("\tSwagger-ui is available on " + swaggerDoc.schemes + "://" + swaggerDoc.host + "/docs");
	  console.log("\tSwagger document is available on " + swaggerDoc.schemes + "://" + swaggerDoc.host + "/api-docs");
    });
  });
});
