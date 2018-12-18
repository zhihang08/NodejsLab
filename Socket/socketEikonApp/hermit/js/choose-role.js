$(function () {
    "use strict"
    // const socket = io('http://10.117.62.137:3000');

    const socket = io('http://10.35.14.200:3000');
    // var room = $("#my-room-input").val();
    const user = {}, user2 = {};
    localStorage.setItem("user", "");
    localStorage.setItem("user2", "");

    localStorage.setItem("round", '0');

    var roomSelected = "";
    // select profile
    $(".icon-img").on("click", function () {
        if (user.symbol) {
            return
        }
        const symbol = $(this).attr("id");
        socket.emit('set symbol', {
            uuid: user.uuid,
            symbol: symbol,
            room: $("#my-room-input").val()
        });
    });
    $(".my-submit").click(function(){
        submitUser();
    })
    $("#my-name-input,#my-room-input").keyup(function (event) {
        if (event.keyCode == 13) {
            // $(".icon-img").off("click");
            submitUser();
            // $("#my-name-input").hide().after(`<p class="name-text" id="my-name-text" >${myName}</p>`);
            // $(".blurred-box").removeClass("after-selected").addClass("completed-selected");
            // $(".right-player").removeClass("non-selected").addClass("non-selected-back");
            // $("#other-name-text").css({"display":"block"});
        }
    });
    socket.on('set symbol', (data) => {
        if (data.status == 'success') {
            if (data.uuid == user.uuid) {
                user.symbol = data.symbol;
                if (data.symbol == 'symbol1') {
                    $('#symbol1-name-text').text(user.name);
                    $('#symbol2-name-text').text(user2.name);
                    user2.symbol = 'symbol2';
                } else {
                    $('#symbol2-name-text').text(user.name);
                    $('#symbol1-name-text').text(user2.name);
                    user2.symbol = 'symbol1';
                }


            } else {
                user2.symbol = data.symbol;
                if (data.symbol == 'symbol1') {
                    user.symbol = 'symbol2';
                    $('#symbol1-name-text').text(user2.name);
                    $('#symbol2-name-text').text(user.name);
                } else {
                    user.symbol = 'symbol1';
                    $('#symbol2-name-text').text(user2.name);
                    $('#symbol1-name-text').text(user.name);
                }

            }
            user.score = '0'
            user2.score = '0'
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("user2", JSON.stringify(user2));
            $(".blurred-box").removeClass("after-input").addClass("completed-selected");
            $(".input-wrapper").hide();

            $(".name-text").css({ "display": "block" });

            if ($('#symbol1-name-text').text() != "" && $('#symbol2-name-text').text() != "") {
                // setTimeout(function(){
                //     window.location.href = "jigsaw-puzzle.html" ;
                // }, 3000);
                skipNextPage()
            }
        }
    });
    socket.on('current room', (data) => {
        let me, other;
        console.log('current room')
        if (data.length == 2) {
            for (let i = 0; i < data.length; i++) {
                let theUser = data[i];
                if (theUser.userName == user.name) {
                    me = theUser;
                }
                if (theUser.userName != user.name) {
                    other = theUser;
                }
            }

            user2.uuid = other.uuid;
            user2.name = other.userName;
            user2.symbol = other.symbol;

            if (other.symbol != undefined) {

                $(".blurred-box").removeClass("after-input").addClass("completed-selected");
                $(".input-wrapper").hide();

                if (other.symbol == 'symbol1') {
                    $('#symbol1-name-text').text(user2.name);
                    $('#symbol2-name-text').text(user.name);
                    user.symbol = 'symbol2';
                } else {
                    $('#symbol2-name-text').text(user2.name);
                    $('#symbol1-name-text').text(user.name);
                    user.symbol = 'symbol1';
                }

                $(".name-text").css({ "display": "block" });
            }

            if (me.symbol != undefined) {
                if (me.symbol == 'symbol1') {
                    // $('#symbol1-name-text').text(user.name);
                    $('#symbol2-name-text').text(other.userName);
                    user2.symbol = 'symbol2';
                } else {
                    $('#symbol2-name-text').text(other.userName);
                    // $('#symbol1-name-text').text(user.name);
                    user2.symbol = 'symbol1';
                }
            }

            if (other.symbol != undefined || me.symbol != undefined) {
                // setTimeout(function(){
                //     window.location.href = "jigsaw-puzzle.html" ;
                // }, 3000);
                skipNextPage()
            }
        }
        user.score = '0'
        user2.score = '0'
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("user2", JSON.stringify(user2));
    });
    socket.emit('add user', null);
    socket.on('user joined', (data) => {
        renderRooms(".room-list", data.playersList);
        focusSelectRoom();
    });
    function skipNextPage() {
        setTimeout(function () {
            window.location.href = "jigsaw-puzzle.html";
            // if(user.symbol === 'symbol1'){
            //     socket.emit('temp leave',{
            //         uuid:user.uuid
            //     })
            // // }

            // socket.on('temp leave',(data) => {
            //     // console.log(data);
            //     if(data.user.userName == user.name){
            //         let leaveID = data.leaveID
            //         localStorage.setItem('leaveID',leaveID)
            //         window.location.href = "jigsaw-puzzle.html" ;
            //     }

            // })

        }, 2000);
    }
    function arrangeByRoom(roomData) {
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
    }
    function renderRooms(container, roomData){

        var $container = $(container).empty();
        // var $inpuPanel = $("<input></input>");
        // $container.html("<div>Room list:</div>");
        var $containerUL = $("<ul class='list' data-search-on-list='list'></ul>");
        if (roomData) {
            var data = arrangeByRoom(roomData);
            data.map((ele)=>{
                var $room = $("<li class='list-item' data-search-on-list='list-item' name='" + ele.room + "'></li>");
                var $subtext = $("<span class='item-list-subtext'>" + ele.count + "</span>");
                var $context = $("<a href='javascript:void(0);' class='list-item-link'>" + ele.room +"</a>");
                $room.append($context).append($subtext);
                // var $room = $("<li class='list-item' data-search-on-list='list-item' name='" + ele.room + "'>" +
                // + "<a href='' class='list-item-link'>" + ele.room 
                // + "<span class='item-list-subtext'>" + ele.count + "</span></a></li>");
                $room.click((e)=>{
                    roomSelected = ele.room;
                    $("#my-room-input").val(ele.room);
                    $(".room-list ul li").removeClass("list-choosen")
                    $(".room-list ul li[name='"+ ele.room +"']").addClass("list-choosen");
                });
                $containerUL.append($room);
            })
            $container.append($containerUL);
            // $container.append($inpuPanel);
            return true;
        }
        return false;
    }
    function submitUser(){
        const myName = $("#my-name-input").val();
            const room = $("#my-room-input").val();
            user.name = myName;
            localStorage.setItem("user", JSON.stringify(user));
            socket.emit('add user', { user: myName, room: room });
            // $("#my-name-input").hide();
            // $(".blurred-box").addClass("after-input");
            // $(".player-icon").css({"display": "block"}).addClass("animated zoomIn");

            socket.on('add user', (data) => {
                console.log(data)
                if (data.uuid == -1) {
                    console.log('room is full')
                }
                else{
                    user.uuid = data.uuid;
                $("#my-name-input").hide();
                $(".container").hide();
                $(".blurred-box").addClass("after-input");
                $(".player-icon").css({ "display": "block" }).addClass("animated zoomIn");
                }
            });
    }
    function focusSelectRoom(){
        if(roomSelected){
            $(".room-list ul li[name='"+ roomSelected +"']").addClass("list-choosen");
        }
    }
});
