var Basic = function () {
  return{
    dragable: function(id) {
      var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
      var elmnt = $("." + id)[0];
      if (id) {
          $("." + id + "_header").mousedown((e)=>{
            dragMouseDown(e);
          });
          $("." + id + "_header").mouseup((e)=>{
            closeDragElement();
          });
      }
      function dragMouseDown(e){
        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
      }

      function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
      }
    },
    formatDate: function(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    },
    getDate: function (timezone = "GMT") {
      let d = new Date();
      return d.getFullYear() + '-' + d.getMonth() + ':'
      +  d.getDay();
    },
    getTime: function(timezone = "GMT") {
      let d = new Date();
      return d.getHours() + ':' + d.getMinutes() + ':'
      +  d.getSeconds() + ':' + d.getMilliseconds();
    }
  }
}();
