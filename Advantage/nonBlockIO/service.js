const express = require("express");
const request = require('request');
var http = require('http');
const port = 8188;
var app = express();

app.get('/',function(req, res){
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
   '<form action="/upload" enctype="multipart/form-data" method="post">'+
   '<input type="text" name="title"><br>'+
   '<input type="file" name="upload" multiple="multiple"><br>'+
   '<input type="submit" value="Upload">'+
   '</form>'
  );
});
app.get('/async',function(req, res){
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
   '<div><p>async</p></div><input type="submit" name="test" value="Test">'
  );
});
app.get('/LoopWithSetTimeout',function(req, res){
  for (var i = 0; i <= 3; i++) {
    setTimeout(function(){
      console.log(i);
    },0);
  }
  res.sendStatus(200);
});
app.get('/LoopBlockTimeout',function(req, res){
  var start = new Date;
  var result = "";
  setTimeout(function(){
    var end = new Date;
    console.log('Time elapsed:', end-start, 'ms');
    result = 'Time elapsed:' + end-start + 'ms';
  },500)
  while(new Date - start < 1000){

  };
  res.status(200).send(result);
});
var server = app.listen(port, function() {
	var runhost = server.address().address;
	var runport = server.address().port;
	console.log("Example app listening at http://%s:%s", runhost, runport);
  console.log(`server is listening on ${port}`)
});
