const express = require("express");
var app = express();
const request = require('request');
var http = require('http');
const port = 8185

const requestHandler = (request, response) => {
  console.log(request.url)
  response.end('Hello Node.js Server!')
}

const httpServer = http.createServer(requestHandler)

multiparty = require('connect-multiparty'),
multipartyMiddleware = multiparty(),
UserController = require('./controllers/UserController');
//Use middleware to handle
app.post('/api/user/uploads', multipartyMiddleware, UserController.uploadFile);
app.post('/uploadF' ,multipartyMiddleware, function(req, res){
  try {
    var file = req.files.file;
    var tmp_path = file.path;
    var target_path = './etc/' + file.name;
    console.log(file);
    var readS = fs.createReadStream(tmp_path);
    var writeS = fs.createWriteStream(target_path);
    readS.pipe(writeS);
    readS.on("end", function() {
       res.send("Upload done");
    });
  } catch (e) {
    res.send(e);
  } finally {

  }

});


app.get('/downloadF',function(req,res){
  var packageName = (req.query.package != null) ? req.query.package.split('.')[req.query.package.split('.').length-2] : null
  var target_path = 'C:/etc/' + req.query.package;
  var writeStream = fs.createWriteStream(target_path);
  var pipe = request('http://localhost:8080/download?package=' + packageName)
      .pipe(writeStream)
      .on('close', function () {
        var stat = fs.statSync(target_path);
        res.writeHead(200, {
              'Content-type': 'application/octet-stream',
              'Content-Length': stat.size
          });
      var readableStream = fs.createReadStream(target_path);
      readableStream.pipe(res);
  });
});
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
