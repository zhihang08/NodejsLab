// const socket = io('http://10.117.62.137:3000');
const socket = io('http://localhost:3000');
    var $window;
    var $usernameInput;
    var $inputMessage;
    var $messages;
    var username;
    var $room;
    var connected;
    var $currentInput;
var socketEntity = function(){
    return{
        initSocket: () =>{
            $window.keydown(event => {
                // Auto-focus the current input when a key is typed
                if (!(event.ctrlKey || event.metaKey || event.altKey)) {
                  $currentInput.focus();
                }
                // When the client hits ENTER on their keyboard
                if (event.which === 13) {
                  if (socketEntity.uuid) {
                    socketEntity.sendMessage();
                    socket.emit('stop typing');
                    typing = false;
                  } else {
                    socketEntity.setUsername();
                  }
                }
              });
              $room.click(()=>{
                $currentInput = $room.focus();
              });
              $usernameInput.click(()=>{
                $currentInput = $usernameInput.focus();
              })
              $inputMessage.on('input', () => {
                // updateTyping();
              });
              $inputMessage.submit(() => {
                updateTyping();
              });
              socket.on('login', (data) => {
                connected = true;
                // Display the welcome message
                var message = "Welcome to Socket.IO Chat – ";
                socketEntity.log(message, {
                  prepend: true
                });
                socketEntity.addParticipantsMessage(data);
              });
              socket.on('uncompressed', (data) => {
                console.log(data);
                
              });
              socket.on('seconds.update', (data) => {
                  var time = new Date(data.time);
                  var timeString = time.getMonth() + "\/" + time.getDate()  + "\/" + time.getFullYear() + " " 
                    + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
                  $(".socketClock").find("div").text(timeString);
              });
            
              // Whenever the server emits 'new message', update the chat body
              socket.on('new message', (data) => {
                socketEntity.addChatMessage(data);
              });
            
              // Whenever the server emits 'user joined', log it in the chat body
              socket.on('user joined', (data) => {
                if(data.username)
                {
                  socketEntity.log(data.username + ' joined');
                  socketEntity.addParticipantsMessage(data);
                }
                if (data.playersList) {
                  socketEntity.renderRooms(".roomList", data.playersList);
                }
              });
              
              // Whenever the server emits 'user left', log it in the chat body
              socket.on('user left', (data) => {
                socketEntity.log(data.username + ' left');
                socketEntity.addParticipantsMessage(data);
                //removeChatTyping(data);
              });
            
              // Whenever the server emits 'typing', show the typing message
              socket.on('typing', (data) => {
                addChatTyping(data);
              });

              socket.on('current room', (data) => {
                console.log(data);
              });
            
              // Whenever the server emits 'stop typing', kill the typing message
              socket.on('stop typing', (data) => {
                removeChatTyping(data);
              });
              
              socket.on('add user', (data)=>{
                if(data.uuid && data.uuid != -1){
                  socketEntity.uuid = data.uuid;
                  localStorage.setItem("uuid", data.uuid);
                  socketEntity.initPages("chat");
                  $currentInput = $inputMessage.focus();
                  console.log("add user success " + data.uuid);
                }
                else{
                  console.log("refuse to add user " + data.uuid);
                }
              });

              socket.on('Q_A begin', (data)=>{
                if(data.gameID)socketEntity.id = data.id
                console.log(data);
              });

              socket.on('Q_A', (data)=>{
                console.log(data);
              });

              
              socket.on('Q_A broadcast', (data)=>{
                // socketEntity.gameID = data.gameID
                console.log(data);
              });

              socket.on('temp leave', (data)=>{
                socketEntity.leaveID = data.leaveID;
                console.log(data)
              })

              socket.on('game init',(data)=>{
                socketEntity.gameID = data.id;
                console.log(data);
              });

              socket.on('game process',(data)=>{
                console.log(data);
              })

              socket.on('Q_A begin broadcast', (data)=>{
                socketEntity.gameID = data.id
                console.log(data);
              });

              socket.on('disconnect', () => {
                socketEntity.log('you have been disconnected');
              });

              socket.on('set symbol', (data) => {
                console.log(data);
              });
            
              socket.on('reconnect', () => {
                socketEntity.log('you have been reconnected');
                if (username) {
                  socket.emit('add user', {
                    "user": username,
                    "room": $room.val(),
                    "uuid": localStorage.uuid 
                  });
                }
              });
            
              socket.on('reconnect_error', () => {
                socketEntity.log('attempt to reconnect has failed');
              });
        },
        initPages: (type)=>{
            if(type != "chat"){
                $(".page").hide();
            }
            else{
                $(".page").fadeOut();
            }
            $("." + type).show();
        },
        setUsername: () => {
            username = $usernameInput.val();//$usernameInput.val();// socketEntity.cleanInput($usernameInput.val());
            // If the username is valid
            // socket.emit('join room', "");
            if (username) {
              // Tell the server your username
              socket.emit('add user', {
                "user": username,
                "room": $room.val(),
                "uuid": localStorage.uuid
              });
            }
        },
        addMessageElement: (el, options) => {
            var $el = $(el);
        
            // Setup default options
            if (!options) {
              options = {};
            }
            if (typeof options.fade === 'undefined') {
              options.fade = true;
            }
            if (typeof options.prepend === 'undefined') {
              options.prepend = false;
            }
        
            // Apply options
            if (options.fade) {
              $el.hide().fadeIn();
            }
            if (options.prepend) {
              $messages.prepend($el);
            } else {
              $messages.append($el);
            }
            $messages[0].scrollTop = $messages[0].scrollHeight;
        },
        addParticipantsMessage: (data) => {
            var message = '';
            if (data.numUsers === 1) {
              message += "there's 1 participant";
            } else {
              message += "there are " + data.numUsers + " participants";
            }
            socketEntity.log(message);
        },
        addChatMessage: (data, options) => {
            var $usernameDiv = $('<span class="username"/>')
              .text(data.username + ": ");
            //   .css('color', getUsernameColor(data.username));
            var $messageBodyDiv = $('<span class="messageBody">')
              .text(data.message);
        
            var typingClass = data.typing ? 'typing' : '';
            var $messageDiv = $('<li class="message"/>')
              .data('username', data.username)
              .addClass(typingClass)
              .append($usernameDiv, $messageBodyDiv);
        
              socketEntity.addMessageElement($messageDiv, options);
        },
        sendMessage: () => {
            var message = $inputMessage.val()
            // Prevent markup from being injected into the message
            // message = cleanInput(message);
            // if there is a non-empty message and a socket connection
            if (message && connected) {
                $inputMessage.val('');
                socketEntity.addChatMessage({
                    username: username,
                    message: message
                });
                // tell server to execute 'new message' and send along one parameter
                socket.emit('new message', {"room": $room.val(), "mes":message});
            }
        },
        log: (message, options) => {
            var $el = $('<li>').addClass('log').text(message);
            socketEntity.addMessageElement($el, options);
        },
        initGame: ()=>{
          socket.emit('add user',{
            "user": username,
            "room": $room.val(),
            "uuid": localStorage.uuid
          })
          socket.emit('game init',{
            uuid: socketEntity.uuid,
            stage: 0,
            leaveID: socketEntity.leaveID
          })
        },
        processGame: (flag)=>{
          socket.emit('game process',{
            uuid: socketEntity.uuid,
            gameID: socketEntity.gameID,
            flag: flag,
            data: {"x":"x","y":"y","data":[1,2,3]}
           })
        },
        Q_A_begin: ()=>{
          socket.emit('Q_A begin',{
            uuid: socketEntity.uuid
          })
        },
        Q_A:(questionNum)=>{
          socket.emit('Q_A',{
            uuid: socketEntity.uuid,
            gameID: socketEntity.gameID,
            question: questionNum,
            answer: "1"
           })
        },
        setSymbol: ()=>{
          socket.emit('set symbol',{
            uuid:socketEntity.uuid,
            symbol: "England",
            room: $room.val()
          })
        },
        end:()=>{
          // socket.disconnect();
          socket.emit('game process',{
            uuid: socketEntity.uuid,
            gameID: socketEntity.gameID,
            stage: -1
           })
        },
        tempLeave: ()=>{
          socket.emit('temp leave',{
            uuid: socketEntity.uuid,
          })
        },
        arrangeByRoom: (roomData)=>{
          var resultData = [];
          roomData.map((ele)=>{
            var index = -1;
            resultData.find((e, i, a)=>{
              if(e.room == ele.room)
              {
                index = i;
                return;
              }
            })
            if(index == -1){
              resultData.push({
                room: ele.room,
                count: 1,
                players: [ele]
              })
            }
            else{
              resultData[index].count += 1;
              resultData[index].players.push(ele);
            }
          })
          return resultData;
        },
        renderRooms:(container, roomData)=>{
          var $container = $(container);
          $container.html("");
          if (roomData) {
            var data = socketEntity.arrangeByRoom(roomData);
            data.map((ele)=>{
              var $room = $("<div><span>" + ele.room + "</span><span>(" + ele.count + ")</span></div>");
              $container.append($room);
            })
            return true;
          }
          return false;
        }
    }
}();
$(function(){
    $window = $(window);
    $usernameInput = $('.usernameInput');
    $inputMessage = $('.inputMessage'); 
    $messages = $('.messages');
    username = "";
    $room = $('.room');
    connected = false;
    $currentInput = $usernameInput.focus();
    socketEntity.initSocket();
    socketEntity.initPages("login");
    socket.emit('add user', null);
    // $(".bqa").click(()=>{
    //   socketEntity.Q_A_begin();
    // })
    $(".bqa").click(()=>{
      socketEntity.initGame();
    });
    $(".qa1").click(()=>{
      socketEntity.processGame("A1");
    });
    // $(".qa1").click(()=>{
    //   socketEntity.Q_A(0);
    // });
    $(".qa2").click(()=>{
      // socketEntity.Q_A(1);
      socketEntity.processGame("A2");
    });
    $(".qa3").click(()=>{
      // socketEntity.Q_A(2);
      socketEntity.processGame("A3");
    });
    $(".qa4").click(()=>{
      // socketEntity.Q_A(3);
      socketEntity.processGame("A4");
    });
    $(".setS").click(()=>{
      socketEntity.setSymbol();
      localStorage.uuid = null;
    });
    $(".end").click(()=>{
      socketEntity.end();
    });
    $(".tempLeave").click(()=>{
      socketEntity.tempLeave();
    });
});