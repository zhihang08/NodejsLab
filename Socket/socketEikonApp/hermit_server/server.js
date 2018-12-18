// Setup basic express server
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var fs = require('fs');
var io = require('socket.io')(http);
var numUsers = 0;
// Routing
// app.use(express.static(path.join(__dirname, 'public')));

var players = {},
    unmatched;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/EikonGameDoc.txt');
});

// app.get('/game', function(req, res){
//   res.sendFile(__dirname + '/chat .html');
// });

app.get('/videoPage', function(req, res){
  res.sendFile(__dirname + '/video.html');
});

app.get('/video', (req, res) => {
  var path = 'video.mp4';
  var stat = fs.statSync(path);
  var file = fs.createReadStream(path, {start: start, end: end});
  var total = stat.size;
  if (req.headers['range']) {
    var range = req.headers.range;
    var parts = range.replace(/bytes=/, "").split("-");
    var partialstart = parts[0];
    var partialend = parts[1];

    var start = parseInt(partialstart, 10);
    var end = partialend ? parseInt(partialend, 10) : total-1;
    var chunksize = (end-start)+1;
    console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

    var file = fs.createReadStream(path, {start: start, end: end});
    res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
    file.pipe(res);
  } else {
    console.log('ALL: ' + total);
    res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
    fs.createReadStream(path).pipe(res);
  }
});

app.get('/Hello', function(req, res){
  res.send('<h1>Hello world</h1>');
});

var EikonGameCenter = function(){
  return{
    PlayersList: [],
    TempPlayerList: [],
    GameList: [],
    HistoryList: [],
    guid:()=>{
      function S4() {
         return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      }
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },

    timer: (socket)=>{
      setInterval(()=>{
        socket.emit('seconds.update',{
          time: new Date()
        });
      })
    },

    checkExist: (userName, room, uuid)=>{
      var i = -1;
      EikonGameCenter.PlayersList.find((ele, index, arr)=>{
        if(uuid != null)
        {
          if(ele.uuid == uuid){
            i = index;
          }
        }
        else if(ele.userName == userName && ele.room == room){
          i = index;
        }
      });
      return i;
    },

    checkHistoryPlayer: (uuid)=>{
      var i = -1;
      EikonGameCenter.TempPlayerList.find((ele, index, arr)=>{
        if(ele.uuid == uuid){
          i = index;
        }
      });
      return i;
    },

    checkSymbol: (room, symbol)=>{
      var user = null;
      EikonGameCenter.PlayersList.find((ele, index, arr)=>{
        if(ele.room == room && ele.symbol == symbol){
          user = ele;
        }
      });
      return user;
    },

    fetchGameIndex: (gameID)=>{
      var gameIndex = null;
      EikonGameCenter.GameList.find((ele, index, arr)=>{
        if(ele.id == gameID){
          gameIndex = index;
        }
      });
      return gameIndex;
    },

    fetchGame: (gameID)=>{
      var game = null;
      if(gameID){
        EikonGameCenter.GameList.find((ele, index, arr)=>{
          if(ele.id == gameID){
            game = ele;
          }
        });
      }
      return game;
    },

    fetchHistoryGame: (gameID)=>{
      var game = null;
      if(gameID){
        EikonGameCenter.HistoryList.find((ele, index, arr)=>{
          if(ele.id == gameID){
            game = ele;
          }
        });
      }
      return game;
    },

    fetchGameByRoom: (roomName, stage)=>{
      var game = null;
      EikonGameCenter.GameList.find((ele, index, arr)=>{
        if (ele.room == roomName && ele.stage == stage) {
          game = ele;
        }
      });
      return game;
    },
    
    fetchUsers: (room)=>{
      var players = [];
      EikonGameCenter.PlayersList.find((ele, index, arr)=>{
        if(ele.room == room)
          players.push(ele);
      });
      return players;
    },

    joinGame: (userName, room, oldID, symbol)=>{
      var uuid = EikonGameCenter.guid();
      //generate user ticket
      var userList = EikonGameCenter.fetchUsers(room);
      var index = EikonGameCenter.checkExist(userName, room);
      var oldIndex = EikonGameCenter.checkHistoryPlayer(oldID);
      var currentUser = EikonGameCenter.PlayersList[index];
      if(index > -1){
        var newUser = {
          userName: currentUser.userName,
          room: currentUser.room,
          uuid: uuid,
          symbol: currentUser.symbol
        }
        //update 
        EikonGameCenter.GameList.map((ele)=>{
          ele.instance.updateUser(currentUser.uuid, newUser);
        });
        EikonGameCenter.PlayersList[index].uuid = uuid;
      }
      else{
        if(userList.length < 2){
            EikonGameCenter.PlayersList.push({
              userName: userName,
              room: room,
              uuid: uuid,
              symbol: symbol
            })
            EikonGameCenter.GameList.map((ele)=>{
              ele.instance.updateUser(oldID, {
                userName: userName,
                room: room,
                uuid: uuid,
                symbol: symbol
              });
            });
        }
        else{
          uuid = -1;
        } 
      }
      return uuid;
    },

    recoverUser:(leaveID)=>{
      var recoverUserList = null;
      var recoverUserIndex = null;
      if(leaveID){
        EikonGameCenter.TempPlayerList.find((ele, index, arr)=>{
          if (ele.uuid == leaveID) {
            recoverUserList = ele.player;
            recoverUserIndex = index;
          }
        });
        if(recoverUserList){
          var index = EikonGameCenter.checkExist(recoverUserList.userName, recoverUserList.room);
          if(index < 0){
            EikonGameCenter.PlayersList.push(recoverUserList);
            console.log("Recover user " + recoverUserList.userName + " " + recoverUserList.uuid);
            
          }
          else{
            EikonGameCenter.PlayersList.splice(index, 1);
            EikonGameCenter.PlayersList.push(recoverUserList);
            console.log("Recover user " + recoverUserList.userName + " " + recoverUserList.uuid + " with delete old one");
          }
          EikonGameCenter.TempPlayerList.splice(recoverUserIndex, 1);
        }
      }
      return recoverUserList
    },

    leaveGame:(uuid)=>{
      try {
        var index = EikonGameCenter.checkExist(null, null, uuid);
        if(index > -1)
        {
          EikonGameCenter.TempPlayerList.push(EikonGameCenter.PlayersList[index]);
          EikonGameCenter.PlayersList.splice(index, 1);
          EikonGameCenter.GameList.find((ele, index, arr)=>{
            ele.instance.playerList.find((e, i, a)=>{
              if(e && e.uuid == uuid){
                ele.instance.playerList.splice(i, 1);
              }
            })
          });
          return true;
        }
        else{
          return true;
        }
      } catch (error) {
        console.log("leaveGame error " + error);
        return true;
      }
    }
  }
}();


io.on('connection', function(socket){
    var addedUser = false;
    // EikonGameCenter.timer(socket);
    console.log('a user connected');
    socket.compress(false).emit('uncompressed', "that's rough");
    socket.compress(true).emit('uncompressed', "that's not rough");
    socket.on('disconnect', ()=>{
      console.log('user disconnected ' + socket.uuid　+ " " + socket.room);
      --numUsers;
      if(socket.uuid && socket.room){
        EikonGameCenter.leaveGame(socket.uuid);
        var currentUser = EikonGameCenter.fetchUsers(socket.room)
        console.log("user " + currentUser.userName + " leave");
        console.log(currentUser);
        socket.nsp.to(socket.room).emit('current room', currentUser);
      }
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
      socket.nsp.emit('user joined', {
        username: null,
        numUsers: null,
        playersList: EikonGameCenter.PlayersList
      });
    });

    socket.on('temp leave',(data)=>{
      var leaveID = null;
      var currentUserIndex = EikonGameCenter.checkExist(null, null, data.uuid);
      if(currentUserIndex > -1){
        var currentUser = EikonGameCenter.PlayersList[currentUserIndex];
        leaveID = EikonGameCenter.guid();
        EikonGameCenter.TempPlayerList.push(currentUser);
        EikonGameCenter.PlayersList.splice(currentUserIndex, 1);
        socket.emit('temp leave', {
          status: "done",
          leaveID: leaveID,
          user: currentUser
        });
      }
      else{
        socket.emit('temp leave', {
          status: "error",
          leaveID: null,
          mes: "unvalid uuid",
          user: currentUser
        });
      }
      
    });

    // socket.on('join room', (roomName)=>{
    //   socket.join(roomName);
    // });

    socket.on('set symbol',(mes)=>{
      var index = EikonGameCenter.checkExist(null, null, mes.uuid);
      var currentUser = EikonGameCenter.PlayersList[index];
      var checkSymbol = EikonGameCenter.checkSymbol(mes.room, mes.symbol);
      if(!checkSymbol){
        //update
        currentUser.symbol = mes.symbol;
        socket.nsp.to(mes.room).emit('set symbol',{
          status: "success",
          uuid: mes.uuid,
          symbol: mes.symbol,
          mes: currentUser.userName + "set symbol" + mes.symbol
        });
      }
      else{
        socket.emit('set symbol',{
          status: "error",
          mes: "has been occupy by " + checkSymbol.userName,
          playerlist: EikonGameCenter.PlayersList,
          user: currentUser
        });
      }
    });

    socket.on('add user', (mes) => {
      if (addedUser) return;
      if(!mes){
        socket.emit('user joined', {
          numUsers: numUsers,
          playersList: EikonGameCenter.PlayersList
        });
        return;
      }
      // we store the username in the socket session for this client
      socket.username = mes.user;
      var uuid = EikonGameCenter.joinGame(mes.user, mes.room, mes.uuid);
      if (uuid != -1) {
        ++numUsers;
        socket.join(mes.room);
        addedUser = true;
        socket.emit('add user', {
          numUsers: numUsers,
          uuid: uuid,
          user: mes.user,
          userList: EikonGameCenter.PlayersList
        });
        console.log('add user ' + mes.user + " to room: " + mes.room + " uuid "+ uuid);
        socket.uuid = uuid;
        socket.room = mes.room;
        socket.emit('login', {
          numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.nsp.emit('user joined', {
          username: socket.username,
          numUsers: numUsers,
          playersList: EikonGameCenter.PlayersList
        });
        var usersInRoom = EikonGameCenter.fetchUsers(mes.room);
        console.log(usersInRoom);
        socket.nsp.to(mes.room).emit('current room', usersInRoom);
      }
      else{
        socket.emit('add user', {
          numUsers: numUsers,
          uuid: uuid,
          user: mes.user,
          userList: EikonGameCenter.PlayersList
        });
      }
    });
    
    socket.on('game init', (data)=>{
      if (data.leaveID) {
        EikonGameCenter.recoverUser(data.leaveID);
      }
      var currentUserIndex = EikonGameCenter.checkExist(null, null, data.uuid);
      if (currentUserIndex < 0) {
          socket.emit('game init', {
            status: "error",
            mes: "unvalid uuid",
            playerInfo: EikonGameCenter.PlayersList
          });
          return;
      }
      var currentUser = EikonGameCenter.PlayersList[currentUserIndex];
      var usersInRoom = EikonGameCenter.fetchUsers(currentUser.room);
      if (usersInRoom.length == 2) {
        var game = EikonGameCenter.fetchGameByRoom(currentUser.room, data.stage);
        if(game){
          console.log("Return old game with " + usersInRoom.length 
          + "Players, stage: " + data.stage + "/" + game.stage +" gameid: " + game.id);

          socket.emit('game init', {
            status: "started",
            mes: "game has start",
            id: game.id,
            playerList: usersInRoom,
            stage: game.stage
          })
          return;
        }
        console.log("Generate new game with " + usersInRoom.length + "Players");
        game = new EikonGameCommon(usersInRoom, data.stage);
        game.beginGame();
        EikonGameCenter.GameList.push({
          id: game.gameID,
          instance: game,
          room: currentUser.room,
          stage: data.stage//game.currentStage
        });
        socket.nsp.to(currentUser.room).emit('game init', {
            status:"success",
            mes:"begin game success",
            id: game.gameID,
            playerList: usersInRoom,
            stage: data.stage//game.currentStage
        });
      }
      else{
        //unvalid user number
        socket.emit('game init', {
          status: "error",
          mes: "insufficient users",
          playerList: usersInRoom
        });
      }
    });

    socket.on('game process', (data)=>{
      var currentUserIndex = EikonGameCenter.checkExist(null, null, data.uuid);
      if (currentUserIndex < 0) {
          socket.emit('game process', {
            status: "error",
            mes: "unvalid uuid",
            data: null,
            playerList: EikonGameCenter.PlayersList
          });
          return;
      }
      var currentUser = EikonGameCenter.PlayersList[currentUserIndex];
      var game = EikonGameCenter.fetchGame(data.gameID);
      if(!game){
        var historyGame = EikonGameCenter.fetchHistoryGame(data.gameID);
        //wait to add
        if(historyGame){
          socket.emit('game process', {
            status: "error",
            mes: "game has ended with current gameID",
            data: historyGame.instance
          });
        }
        else{
          socket.emit('game process', {
            status: "error",
            mes: "unvalid gameID",
            data: null
          });
        }
        return;
      };
      if (data.stage == -1) {
        socket.nsp.to(currentUser.room).emit('game process', {
          action: currentUser,
          status: "end",
          mes: "end game",
          data: game.instance.gameMark
        });
        EikonGameCenter.HistoryList.push(game);
        delete game.instance;
        EikonGameCenter.GameList.splice(EikonGameCenter.fetchGameIndex(data.gameID),1);
      }
      else{
        game.instance.gameHandler(data.uuid, data.room, data.data, data.flag, (user, data, result, marks)=>{
          socket.nsp.to(currentUser.room).emit('game process', {
            action: currentUser,
            status: result,
            mes: "update result: " + result,
            data: marks
          });
        });
      }
    });

    socket.on('Q_A begin', (data)=>{
      var currentUserIndex = EikonGameCenter.checkExist(null, null, data.uuid);
      if (currentUserIndex < 0) {
          socket.emit('Q_A begin', {
            status: "error",
            mes: "unvalid uuid",
          });
          return;
      }
      var currentUser = EikonGameCenter.PlayersList[currentUserIndex];
      var usersInRoom = EikonGameCenter.fetchUsers(currentUser.room);
      if (usersInRoom.length > 2) {
        var game = EikonGameCenter.fetchGameByRoom(currentUser.room);
        if(game){
          socket.emit('Q_A begin', {
            status: "started",
            mes: "game has start",
            id: game.id,
            question: game.instance.currentStage
          })
          return;
        }
        var questionCount = (data.questionCount)?data.questionCount:4;
        game = new EikonGameQuickerAnswer(usersInRoom, questionCount);
        game.beginGame();
        EikonGameCenter.GameList.push({
          id: game.id,
          instance: game,
          room: currentUser.room
        });
        socket.nsp.to(currentUser.room).emit('Q_A begin broadcast', {
            status:"success",
            mes:"begin Q_A game success",
            id: game.id,
            playerList: usersInRoom,
            beginQuestion: 0
        });
      }
      else{
        //unvalid user number
        socket.emit('Q_A begin', {
          status: "error",
          mes: "insufficient users",
        });
      }
    });

    socket.on('Q_A', (data)=>{
      var currentUserIndex = EikonGameCenter.checkExist(null, null, data.uuid);
      if(currentUserIndex < 0){
        socket.emit('Q_A', {
            status: "error",
            mes: "unvalid uuid"
        });
        return;
      }
      var currentUser = EikonGameCenter.PlayersList[currentUserIndex];
      var game = EikonGameCenter.fetchGame(data.gameID);
      var gameByRoom = EikonGameCenter.fetchGameByRoom(currentUser.room);
      if(!gameByRoom){
        socket.emit('Q_A', {
          status: "error",
          mes: "cannot find gameID: " + data.gameID,
        });
        return;
      }
      if(!game){
        socket.emit('Q_A', {
          status: "error",
          mes: "cannot find gameID: " + data.gameID,
          refGameID: gameByRoom.id 
        });
        return;
      }
      game.instance.gameHandler(data.uuid, currentUser.room,
        data.answer, data.question, (uuid, room, answer, q_number, result, marks)=>{
          console.log("Room:" + room  + " update answer " + result, marks);
          if(result == "done"){
            socket.nsp.to(currentUser.room).emit('Q_A broadcast', {
              status:"success",
              mes: "Q_A game question "+ q_number +" success",
              gameID: data.gameID,
              currentResult: {
                question: q_number, 
                answer: answer, 
                user: currentUser.username
              },
              gameResult: marks
            });
          }
          else{
            socket.emit('Q_A',{
              status:"error",
              mes: result
            })
          }
      });
      if(game.instance.currentStage == game.instance.totalQuestion-1){
        socket.broadcast.to(currentUser.room).emit('Q_A', {
          status: "finish",
          mes: "Q_A game all question finish",
          instanceID: data.gameID,
          gameResult: game.instance.gameMark
        });
        EikonGameCenter.HistoryList.push(game);
        delete game.instance;
        EikonGameCenter.GameList.splice(EikonGameCenter.fetchGameIndex(data.gameID),1);
      }
    });

    socket.on('new message', (data) => {
      console.log("New Message: " + data.mes);
      // we tell the client to execute 'new message'
      socket.broadcast.to(data.room).emit('new message', {
        username: socket.username,
        message: data.mes
        });
      });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
    //GameTester();
    //GameDefaultInit();
});


class EikonGameCommon {
  constructor(playerList, stage) {
    this.playerList = playerList;
    this.currentStage = (stage)?stage:0;
    this.status = "open";
    this.gameMark = new Array();
    this.flagList = new Array();
    this.gameID = EikonGameCenter.guid();
  }
  beginGame(){
    this.playerList.map((ele)=>{
      this.gameMark.push({
        userName: ele.userName,
        uuid: ele.uuid,
        room: ele.room,
        data: null
      });
    })
  }
  checkPlayer(uuid){
    var result = false;
    if (this.playerList != null) {
      this.playerList.find((ele,index)=>{
        if(!ele){
          console.log("check null player list!");
          console.log(this.playerList);
          return result;
        }
        if(ele.uuid == uuid){
          result = true;
        }
      })
    }
    return result;
  }
  updateUser(oldUuid, player){
    var index = -1;
    if(this.playerList != null){
      if (oldUuid ) {
        this.updatePlayer(oldUuid, player);
        this.playerList.find((e, i)=>{
          if(!e){
            console.log("update user encounter null user list");
            console.log(this.playerList);
            this.playerList = null;
            return index = -2;
          }
          if(e.uuid == oldUuid){
            index = i
          }
        })
      }
      if(index > -1){
        this.playerList[index] = player.id;
      }
      if(index == -1){
        this.playerList.push(player);
      }
    }
    else{
      index = -3;
    }
    return index;
  }
  updatePlayer(oldUuid, player){
    var index = -1;
    this.gameMark.find((e, i, a)=>{
      if(e){
        if(e.userName == player.userName && e.uuid == oldUuid){
          e.uuid = player.uuid;
          index = i;
        }
      }
      else{
        console.log("cannot update user with " + oldUuid);
        console.log(player);
      }
    })
    return index;
  }
  updateGameMark(uuid, userData, flag){
    var result = -1;
    var hasflag = false;
    if(flag){
      this.flagList.find((ele, index, arr)=>{
        if(ele == flag){
          hasflag = true;
          result = -2
        }
      })
    }
    if (!hasflag) {
      this.gameMark.find((ele, index, arr)=>{
        if(ele.uuid == uuid && !hasflag){
          ele.data = userData;
          result = index;
          this.flagList.push(flag);
        }
      });
    }
    return result;
  }
  gameHandler(uuid, room, data, flag, callback){
    if(!callback) return;
    if(!this.checkPlayer(uuid)) 
    {
      callback(uuid, data, "notPlayer");
      return;
    }
    var updateStatus = this.updateGameMark(uuid, data, flag);
    if(updateStatus == -2){
      callback(uuid, data, "duplicate", this.gameMark);
      return;
    }
    else if(updateStatus == -1){
      callback(uuid, data, "fail", this.gameMark);
      return;
    }
    else{
      callback(uuid, data, "success", this.gameMark);
      return;
    }
  }
};

class EikonGameQuickerAnswer {
  constructor(playerList, questionCount) {
    this.playerList = playerList;
    this.currentStage = 0;
    this.status = "on";
    this.totalQuestion = questionCount;
    this.gameMark = new Array();
    this.id = EikonGameCenter.guid();
  }
  beginGame(){
    this.setGameStage(0);
  }
  checkGameStage(q_number){
    var result = false;
    this.gameMark.find((ele, value, index)=>{
      if(ele.q_number == q_number){
        result = true;
      }
    });
    return result;
  }
  checkPlayer(uuid){
    var result = false;
    this.playerList.find((ele,index)=>{
      if(ele.uuid == uuid){
        result = true;
      }
    })
    return result;
  }
  updateGameMark(uuid, answer, q_number){
    var result = -1;
    this.gameMark.find((ele, index, arr)=>{
      if(ele && ele.q_number == q_number && ele.uuid == null && ele.answer == null){
        ele.uuid = uuid;
        ele.answer = answer;
        ele.q_number = q_number;
        result = index;
      }
    });
    return result;
  }
  gameHandler(uuid, room, answer, q_number, callback){
    if(!callback) return;
    if(!this.checkGameStage(q_number)) 
    {
      callback(uuid, room, answer, q_number, "stageNotOpen");
      return;
    }
    if(!this.checkPlayer(uuid)) 
    {
      callback(uuid, room, answer, q_number, "notPlayer");
      return;
    }
    if(this.updateGameMark(uuid, answer, q_number) != -1){
      //broadcast
      var newStage = q_number + 1;
      setTimeout(() => {
        this.setGameStage(newStage);
      }, 1000);
      if(callback)
        callback(uuid, room, answer, q_number, "done", this.gameMark);
    }
    else{
      callback(uuid, room, answer, q_number, "duplicate");
    }
  }
  setGameStage(Stage){
    this.gameMark.push({
      uuid: null,
      answer: null,
      q_number: Stage
    });
    this.currentStage = Stage;
  }
};


