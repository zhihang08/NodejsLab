UserController = function() {};
fs = require('fs');
util = require('util');

UserController.prototype.uploadFile = function(req, res) {
    // We are able to access req.files.file thanks to
    // the multiparty middleware
    var file = req.files.file;
    var tmp_path = file.path;
    var target_path = './etc/' + file.name;
    console.log(file);
    var readS = fs.createReadStream(file.path)
    var writeS = fs.createWriteStream(target_path);
    readS.pipe(writeS);
    readS.on("end", function() {
       res.send("Upload done");
    });
}
module.exports = new UserController();
