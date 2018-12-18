const winScore = 10;
const failScore = -5;
var description = '作品甄别,不同派别的20幅作品,您需要与对手竞争拖拽到对应派别,拖拽正确每幅作品得10分,拖拽错误扣5分 扣5分 扣5分!!!'
var img_z_index = 100;
var score = 0;
var vs_score = 0;
var user = JSON.parse(localStorage.getItem('user'));
var user2 = JSON.parse(localStorage.getItem('user2'));
// const socket = io('http://10.35.14.200:3000');

const socket = io('http://10.117.62.137:3000');
var oppsideCount = 0;

const sort = {
    "sort1-box": ['item-2-Y-1', 'item-2-Y-2', 'item-2-Y-3', 'item-2-Y-4', 'item-2-Y-5', 'item-2-Y-6',
        'item-2-Y-7', 'item-2-Y-8', 'item-2-Y-9', 'item-2-Y-10', 'item-2-Y-11', 'item-2-Y-12', 'item-2-Y-13', 'item-2-Y-14'],
    "sort2-box": ['item-2-N-1', 'item-2-N-2', 'item-2-N-3', 'item-2-N-4', 'item-2-N-5', 'item-2-N-6']
};

$(function () {
    localStorage.setItem('round', 2)
    $window = $(window);
    // username = "test-puzzle";
    socketEntity.initSocket();

    $(document).bind('selectstart', function () { return false; });

    $(".item img").draggable({
        revert: 'invalid',
        start: function (event, ui) {
            $("#" + ui.helper.parent().attr("id")).css("z-index", ++img_z_index)
        }
    });
    $(".sort-box").droppable({
        drop: function (event, ui) {
            const sortName = $(this).attr("id");
            const itemList = sort[sortName];
            const item = $(ui.helper);
            $(ui.helper).addClass("ui-draggable-disabled")
            let itemId = item.parent().attr("id");
            $("#" +itemId + " img").draggable("disable");

            let data = { id: item.parent().attr("id"), sortName: sortName }
            socketEntity.emitProcess(data)
        }
    });
});
// hint paper
const hintArray = [
    "其中一幅画的名字是-浪子回头。画中跪下的是小儿子。",
    "有两副画的作者都是达芬奇",
    "米开朗琪罗以人物“健美”著称，即使女性的身体也描画的肌肉健壮。",
    "表现永恒精神时期最有代表性的一幅是1824年的《北极冰海遇难船》",
    "达·芬奇《柏诺瓦的圣母》这幅画中，花家里用顶端的两扇圆拱的窗户设计，将观赏者的注意力引导到坐在板凳上的圣母玛利亚与圣婴耶稣身上。"
];
let num = 0;
const max = 5;
function hintLoop(index) {
    $("#hint-text").text(hintArray[index]);
    $("#hint-paper").fadeIn(2000, function () {

    });

    setTimeout(function () {
        $("#hint-paper").fadeOut(2000, function () {
            hintLoop(num);
        });
    }, 6000);

    if (num < max) {
        num++;
    } else {
        num = 0;
    }
}
function updateScore() {
    if (user.symbol === 'symbol1') {
        socket.emit('game init', { uuid: user.uuid, stage: -1 })
    }
    finishGameAnimate(score > vs_score ? 'win' : 'fail')
    user.score += score;
    localStorage.setItem("user", JSON.stringify(user))

    user2.score += vs_score
    localStorage.setItem("user2", JSON.stringify(user2))
    // win
}
// const socket = io('http://10.117.62.137:3000');
var socketEntity = function () {

    // var iNum = 77
    // var roomName = 'room' + iNum;
    // var userName = "user"+iNum+"1";
    // var userName = "user" + iNum + "2";
    return {
        initSocket: () => {
            var room = localStorage.getItem('room')

            socket.emit('add user', { user: user.name, room: room, uuid: user.uuid });
            user.uuid = ''
            user2.uuid = ''

            socket.on('add user', (data) => {
                if (data.uuid == -1) {
                    console.log('room is full')
                }
            });

            socket.on('current room', (data) => {
                let local_user = JSON.parse(localStorage.getItem('user'))
                let local_user2 = JSON.parse(localStorage.getItem('user2'))
                if (data.length == 2) {
                    for (let i = 0; i < data.length; i++) {
                        let userItem = data[i];
                        if (userItem.userName == user.name) {
                            if (local_user.uuid != userItem.uuid) {
                                user.uuid = userItem.uuid
                            }
                        } else if (userItem.userName == user2.name) {
                            if (local_user2.uuid != userItem.uuid) {
                                user2.uuid = userItem.uuid
                            }
                        }
                    }
                    if (user.uuid && user2.uuid) {
                        socket.emit('game init', { uuid: user.uuid, stage: 2 })
                        localStorage.setItem('user', JSON.stringify(user))
                        localStorage.setItem('user2', JSON.stringify(user2))
                    }

                }
            });
            socket.on('game init', (data) => {
                if (!data.status) {
                    alert('Error:' + data.mes)
                    return
                }
                if (data.playerList && data.playerList.length == 2) {
                    gameInstanceId = data.id;
                    beginAnimate();
                    setTimeout(function () {
                        hintLoop(0);
                    }, 0);
                }
            })
            socket.on('game process', (data) => {
                let resultStatus = false;
                let $item = null;
                qAnswer = {}

                if ($(".left-box").find('img').length == $(".ui-draggable-disabled").length) {
                    updateScore();
                }

                for (let i = 0; i < data.data.length; i++) {
                    if (data.data[i].userName === data.action.userName) {
                        qAnswer = data.data[i].data
                        resultStatus = sort[qAnswer.answer].indexOf(qAnswer.question) !== -1;
                        $item = $("#" + qAnswer.question);
                        break;
                    }
                }

                if (data.action.userName == user.name) {
                    score = qAnswer.score + (resultStatus ? winScore : failScore);
                    if (resultStatus) {
                        $item.find('img').css({ "box-shadow": "0px 0px 10px #0f0" });
                    } else {
                        $item.find('img').css({ "box-shadow": "0px 0px 10px #f00" });
                    }
                    // $item.draggable("disable");
                } else {
                    vs_score = qAnswer.score + (resultStatus ? winScore : failScore);
                    $item.addClass("animated bounceOut")
                    oppsideCount++;
                }

                if ($(".left-box").find('img').length == $(".ui-draggable-disabled").length + oppsideCount) {
                    updateScore();
                }

                // console.log("score:" + score);
                // console.log("vs_score:" + vs_score);
                $("#score").html(score)
                $("#vs-score").html(vs_score)
            })


            socket.on('login', (data) => {
                connected = true;
                // Display the welcome message
                var message = "Welcome to Socket.IO Chat – ";
                socketEntity.log(message, {
                    prepend: true
                });
                socketEntity.addParticipantsMessage(data);
            });

            socket.on('seconds.update', (data) => {
                var time = new Date(data.time);
                var timeString = time.getMonth() + "\/" + time.getDate() + "\/" + time.getFullYear() + " "
                    + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
                $(".socketClock").find("div").text(timeString);
            });

            // Whenever the server emits 'new message', update the chat body
            socket.on('new message', (data) => {
                socketEntity.handleNewMessage(data);
            });

            // Whenever the server emits 'user joined', log it in the chat body
            socket.on('user joined', (data) => {
                socketEntity.log(data.username + ' joined');
                socketEntity.addParticipantsMessage(data);
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

            // Whenever the server emits 'stop typing', kill the typing message
            socket.on('stop typing', (data) => {
                removeChatTyping(data);
            });

            socket.on('disconnect', () => {
                socketEntity.log('you have been disconnected');
            });

            socket.on('reconnect', () => {
                socketEntity.log('you have been reconnected');
                if (user.name) {
                    socket.emit('add user', { uuid: user.uuid, room: room, name: user.name });
                }
            });

            socket.on('reconnect_error', () => {
                socketEntity.log('attempt to reconnect has failed');
            });
        },

        emitProcess: (data) => {
            socket.emit('game process', {
                data: {
                    question: data.id,
                    answer: data.sortName,
                    score: score,
                    vs_score: vs_score
                },
                uuid: user.uuid,
                gameID: gameInstanceId
                // uuid:commonUtil.getMyName(),
                // gameID:commonUtil.getGameInstanceId()
            })
        },
        handleNewMessage: (data) => {
            if (data.type == "dropped") {
                $("#" + data.id).hide();
                $("#vs-score").text(data.score);
            }
        },
        initPages: (type) => {
            if (type != "chat") {
                $(".page").hide();
            }
            else {
                $(".page").fadeOut();
            }
            $("." + type).show();
        },
        setUsername: () => {
            username = $('.usernameInput').val()//$usernameInput.val();// socketEntity.cleanInput($usernameInput.val());

            // If the username is valid
            if (username) {
                socketEntity.initPages("chat");
                $currentInput = $inputMessage.focus();

                // Tell the server your username
                socket.emit('add user', username);
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
            var message = $inputMessage.val()// $(".inputMessage").val();
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
                socket.emit('new message', message);
            }
        },
        log: (message, options) => {
            // var $el = $('<li>').addClass('log').text(message);
            console.log("socket log: " + message);
            // socketEntity.addMessageElement($el, options);
        }
    }
}();