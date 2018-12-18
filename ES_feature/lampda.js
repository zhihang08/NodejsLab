require("./main.js");
var materials = [];
for (var i = 0; i < 10; i++) {
  materials.push(main.makeid(main.characters, Math.random()*10))
}
console.log("======== default return =========");
console.log(materials.map(item => item.length));
console.log("======== specific return =========");
console.log(materials.filter((item)=>{ return item.length>5 }));
console.log("======== multiple parameter =========");
console.log(materials.some((...arg)=>{ return arg[0].length>8 }));
console.log("======== this scope =========");
var obj = {
  i: 10,
  b: () => console.log(this.i, this),
  c: function() {
    console.log(this.i, this);
  }
}
obj.b();
obj.c();
console.log("======== this passing order =========");
function originFunction() {
  console.log("Done");
  return 1;
}
function handler(callback){
  callback = callback||(() => {
    return 0;
  });
  console.log(callback);
}
handler(originFunction());
handler();
