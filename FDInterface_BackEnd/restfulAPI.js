
'use strict';

module.exports.setup = function(app) {
    app.param('username', function (req, res, next, username) {
        //-1 not valid, 0 not exist, 1 exist
        req.username = username;
        req.validation = user.valid(username);
        if(req.validation){
            req.result = user.checkExist(req.username);
        }else{
            req.result = -1;
        }
        return next();
    });

    /**
   * @swagger
   * tags:
   *   name: Users
   *   description: User management and login
   */
    /**
   * @swagger
   * tags:
   *   name: Files
   *   description: File management
   */

    /**
   * @swagger
   * /checkExist:
   *   get:
   *     description: Returns users exist
   *     tags:
   *      - Users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: users
   */
    app.get('/checkExist/:username', (req, res) => {
        res.send("<p>checkExist done!" + req.result + "</p>");
    });

    /**
   * @swagger
   * /addUser:
   *   post:
   *     description: Add user
   *     tags:
   *      - Users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: users
   */
    app.post('/addUser', (req, res) => {
        var result = "<p>addUser done!" + user.addUser() + "</p>" ;
        res.status(200).send(result);
    });

    /**
   * @swagger
   * /addUser:
   *   delete:
   *     description: delete user
   *     tags:
   *      - Users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: users
   */
    app.delete('/deleteUser', (req, res) => {
        res.send("<p>deleteUser done!</p>");
    });

    /**
   * @swagger
   * /modifyUser:
   *   post:
   *     description: modify user
   *     tags:
   *      - Users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: users
   */
    app.post('/modifyUser', (req, res) => {
        res.send("<p>modifyUser done!</p>");
    });

    /**
   * @swagger
   * /listUser:
   *   get:
   *     description: get user list
   *     tags:
   *      - Users
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: users
   */
    app.get('/listUser', (req, res) => {
        res.send("<p>listUser done!</p>");
    });

    /**
   * @swagger
   * /file:
   *   get:
   *     description: get file
   *     tags:
   *      - Files
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: users
   */
    app.get('/file',(req, res)=>{
        var fileName = req.url.split('=')[1];
        console.log("got file url: "+ req.url + " fileName: " + fileName);
        var filePath = __dirname + '/public/' + fileName;
        if(fs.existsSync(filePath)){
        fs.readFile(filePath, "utf8", function (err, data) {
            if (err) {
            res.send(err);
            }
            res.send({
            "code":"Done",
            "data":data
            });
        });
        }
        else{
        res.send("cannot find file "+ fileName + " in path: " + filePath);
        }
    })
};