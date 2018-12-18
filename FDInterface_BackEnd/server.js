const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const mongoClient= require('mongodb').MongoClient;
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerUi = require('swagger-ui-express');
var apis = require("./restfulAPI.js");
apis.setup(app);
// app.disable('etag');

//set up swagger doc
var swaggerDefinition = {
    info: { // API informations (required)
      title: 'FD server API', // Title (required)
      version: '1.0.0', // Version (required)
      // description: 'A sample API', // Description (optional)
    },
    host: 'localhost:3005', // Host (optional)
    basePath: '/', // Base path (optional)
  };
  
  // Options for the swagger docs
  var options = {
    // Import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // Path to the API docs
    apis: ['./restfulAPI*.js', './parameters.yaml'],
  };
  
  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
  var swaggerSpec = swaggerJSDoc(options);
  
  // Serve swagger docs the way you like (Recommendation: swagger-tools)
  app.get('/api-docs.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
//set up swagger ui
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


require("./user.js");
require("./audit.js");
require("./mongoAdapter.js");

mongoAd.initDB(mongoClient);

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/client')));


var login = 0;
app.get('*', (req, res, next) => {
    console.log(++login + " request arrive. url: " + req.url + " from " + req.host);
    audit.info("request arrived. url:" + req.url + " from " + req.host);
    next();
});

app.get('/*', function(req, res, next){ 
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    next(); 
  });

app.get('/', (req, res) => {
    res.send("<p>Connection done!</p>");
});



app.listen(27000, () => console.log('Example app listening on port 27000!'))