let basic = require("./basic_feature.js");
class RIC {
  constructor(bmkName, tenors, dp) {
    this.bmkName = bmkName;
    this.tenors = tenors;
    this.dp = dp;
    this.quote = "";
    this.quote_1 = "";
    this.quote_2 = "";
    this.quote_3 = "";
    this.value_dt = "";
    this.value_dt1 = "";
    this.value_dt2 = "";
    this.value_dt3 = "";
    this.value_ts = "";
    this.value_ts1 = "";
    this.value_ts2 = "";
    this.value_ts3 = "";
  }
  updateQuote(val) {
    this.rolldown();
    this.value_ts = "";
    this.value_dt = "";
    this.quote = String(val);
    this.value_dt = String(basic.getDate());
    this.value_ts = String(basic.getTime());
  }
  rolldown(collection= ["quote", "value_dt", "value_ts"]) {
    collection.map((ele)=>{
      this[ele + "3"] = this[ele + "2"];
      this[ele + "2"] = this[ele + "1"];
      this[ele + "1"] = this[ele];
      this[ele] = "";
    });
  }
}

Fixing = {
  quoteList : ["JPY", "EUR", "ABS", "CNH", "BMK", "BITC", "VND"],
  simulateRics : [],
  initData: function() {
    Fixing.quoteList.map((bmk)=>{
      Fixing.simulateRics.push(new RIC(bmk, "", 3));
    });
  },
  simulateQuote: function() {
    //choose a random fixing to update
    let rand = Fixing.quoteList[Math.floor(Math.random() * Fixing.quoteList.length)];
    let target = Fixing.simulateRics.filter((ric)=>{
      if (ric.bmkName == rand)
      return ric;
    });
    let factor = Math.random();
    if (target.length == 1) {
      target[0].updateQuote((factor>0.3)?(target.quote + factor):(target.quote - factor));
    }
  },
  updateWatcher: function() {
    
  },
  generateSnapshot: function () {
    let quoteFlashshot = [];
    Fixing.quoteList.map((bmk)=>{
      quoteFlashshot.push()
    });
    return quoteFlashshot;
  }
}
