a = "hello";
main = function(){
  return{
    characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    numbers: "0123456789",
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
    }
  }
}();
