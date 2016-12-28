var app = express();
const express = require("express");
const request = require('request');
const http = require('http');
const cluster = require('cluster');
const port = 8185

const requestHandler = (request, response) => {
  console.log(request.url)
  response.end('Hello Node.js Server!')
}

const httpServer = http.createServer(requestHandler)

app.get('/',function(req, res){
  res.setHeader('Content-Type', 'text/html');
  res.send("<html><head><title>Index</title></head><body><div>Wecome to HOSTed website, test by ZzZ</div></body></html>");
});

var server = app.listen(port, function() {
	var runhost = server.address().address;
	var runport = server.address().port;
	console.log("Example app listening at http://%s:%s", runhost, runport);
  console.log(`server is listening on ${port}`)
});

// httpServer.listen(port, (err) => {
//   if (err) {
//     return console.log('something bad happened', err)
//   }
//
//   console.log(`server is listening on ${port}`)
// })
