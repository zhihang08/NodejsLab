a = "hello";
main = function(){
  return{
    characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    numbers: "0123456789",
    genders: "01",
    makeid: function(pool, targetLength = 5) {
      var text = "";
      for (var i = 0; i < targetLength; i++)
        text += pool.charAt(Math.floor(Math.random() * pool.length));
      return text;
    },
    getKeyByValue: function(obj, val) {
      var key;
      if (typeof(obj) == "object") {
        Object.keys(obj).some(function(k){
          if(obj[k] == val){
            key = k;
            return true;
          };
        });
        return key;
      }
      console.log(typeof(obj));
      return "ErrorType";
    },
    randomNum: function (min, max) {
      var range = 0;
      if (max && min) {
        range = max - min + 1;
      }
      else{
        range = 10;
      }
      return Math.random()*range;
    },
    generateToken: function(){
      var rand = function() {
          return Math.random().toString(36).substr(2); // remove `0.`
      };
      return rand() + rand();
      
  },
  }
}();
