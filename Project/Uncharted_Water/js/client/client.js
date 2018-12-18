$(()=>{

  var $window = $(window);
  var socket = io();
  var connected = false;
  var mkt_status = false;
  Basic.dragable("msg_center");
  $("#register").click(()=>{
    var userName = $("#userName").val();
    socket.emit('login_user', (userName)?userName:"_DefaultUser");
    $(".entrance").toggle();

    $(".message_panel, .main_panel, .msg_center").toggle();
  });
  $("#send_mes").click(()=>{
    var mes = $("#imm_mes").val();
    socket.emit('chat_mes', (mes) ? mes : "");
  });
  $("#open_mkt").click(()=>{
    mkt_status = !mkt_status;
    socket.emit('streaming',{
      status: mkt_status
    });
  });
  socket.on('streaming_data', function (data) {
    console.log(data);
  });
  socket.on('gl_message', function (data) {
    console.log(data);
    $(".global").append($('<li>').text(Basic.formatDate(new Date()) + " " + data));
  });
  solar.init("main_canvas");
  // UW.init("main_canvas");
});
var sun = new Image();
var moon = new Image();
var earth = new Image();
var solar = {
  init: function() {
    sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
    moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
    earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
    window.requestAnimationFrame(solar.draw);
  },
  draw: function () {
    var ctx = $("#main_canvas")[0].getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, 300, 300); // clear canvas

    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
    ctx.save();
    ctx.translate(150, 150);

    // Earth
    var time = new Date();
    ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
    ctx.translate(105, 0);
    ctx.fillRect(0, -12, 50, 24); // Shadow
    ctx.drawImage(earth, -12, -12);

    // Moon
    ctx.save();
    ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
    ctx.translate(0, 28.5);
    ctx.drawImage(moon, -3.5, -3.5);
    ctx.restore();

    ctx.restore();

    ctx.beginPath();
    ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
    ctx.stroke();

    ctx.drawImage(sun, 0, 0, 300, 300);

    window.requestAnimationFrame(solar.draw);
  }
}
