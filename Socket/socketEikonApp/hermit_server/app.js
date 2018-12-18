
function configure(app) {
    // app.use(express.static(path.join(__dirname, 'public')));
    app.get("SocketConnect", function(context, payload, req, res){
        try {
            io.emit('an event sent to all connected clients');
            res.send(200, "ok");
        }
        catch(e)
        {
          console.log(e);
          res.send(e);
        }
      });
}

exports.configure = configure;