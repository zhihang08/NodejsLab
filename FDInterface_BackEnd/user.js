require("./mongoAdapter.js");
a = "hello";
user = function(){
  return{
    addUser: ()=>{
        return "d";
    },
    checkExist: (userName)=>{
        if(userName){
            return mongoAd.checkUserName(userName);
        }
        else{
            return -1;
        }
        
    },
    valid:(userName)=>{
        return true;
    }
  }
}();