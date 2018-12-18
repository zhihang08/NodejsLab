$(()=>{
  var socket = io();
  var connected = false;
  var mkt_status = false;
  Basic.dragable("msg_center");
  $("#send_mes").click(()=>{
    var mes = $("#imm_mes").val();
    socket.emit('chat_mes', (mes) ? mes : "");
  });
  $("#open_mkt").click(()=>{
    mkt_status = !mkt_status;
    socket.emit('streaming', {
      status: mkt_status
    });
  });
  MarketSimulator.init("mkt_panel");
  socket.on('streaming_data', function (data) {
    MarketSimulator.dataHandle(data);
  });
  socket.on('gl_message', function (data) {
    console.log(data);
    $(".global").append($('<li>').text(Basic.formatDate(new Date()) + " " + data));
  });
});

var MarketSimulator = {
    target: null,
    init: function(targetId) {
      MarketSimulator.target = $("#" + targetId);
    },
    dataHandle: function(data) {
        return data.map((item)=>{
          console.log($(".cont_" + item.Name).length);
          ($(".cont_" + item.Name).length > 0)?
          MarketSimulator.updatePanel(item):
          MarketSimulator.generatePanel(item)
        });
    },
    generatePanel: function(con) {
      let $contPanel = $("<div class='cont_" + con.Name + "'></div>");
      let $contName = $("<div class='contName'>" + con.Name + "</div>");
      let $contQuote = $("<div class='contQuote'>" + con.Quote + "</div>");
      let $contNetChange = $("<div class='contNetchange'>" + con.Netchange + "</div>");
      var contributor = $contPanel.append($contName).append($contQuote).append($contNetChange);
      MarketSimulator.target.append(contributor);
    },
    updatePanel: function(con) {
      $(".cont_" + con.Name).find(".contQuote").text(con.Quote);
      $(".cont_" + con.Name).find(".contNetchange").text(con.Netchange);
    }
}
