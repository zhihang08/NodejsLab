
/* Reduce feature in ES5

Function array.reduce(function(total, currentValue, currentIndex, arr), initialValue)

Conclution: reduce is working for arry, can replace for and while loop feature,
in a more effecient way
 */
const arr = [1,2,3,4,5];
const resPool = {};
Array.prototype.forLoop = function (){
  let loopResult = 0;
  for (let i = 0; i < 100000; i++) {
    var sumResult = 0;
    for (let j = 0; j <this.length; j++) {
      sumResult += parseInt(this[j]);
    }
    loopResult = sumResult;
  }
  return loopResult;
}

Array.prototype.whileLoop = function () {
  let sumResult = 0;
  for (let i = 0; i < 100000; i++) {
    let result = 0;
    let j = 0;
    while(j < this.length)
    {
     result += parseInt(this[j]);
     j++;
    }
    sumResult = result;
  }
  return sumResult;
}

Array.prototype.sum = function(){
  let sumResult = 0;
  for (var i = 0; i < 100000; i++) {
     this.reduce((preValue, curValue) => {
       return sumResult = preValue + curValue;
    });
  }
  return sumResult;
}

Array.prototype.forEachTest = function(){
  let sumResult = 0;
  for (let i = 0; i < 100000; i++) {
    let result = 0;
    this.forEach((value, i) => {
      result += value;
    });
    sumResult = result;
  }
  return sumResult;
}

Array.prototype.mapTest = function(){
  let sumResult = 0;
  for (let i = 0; i < 100000; i++) {
    let result = 0;
    this.map((value, i) => {
      result += value;
    });
    sumResult = result;
  }
  return sumResult;
}

console.time("forLoop");
resPool.resF = arr.forLoop();
console.timeEnd("forLoop");

console.time("whileLoop");
resPool.resW = arr.whileLoop();
console.timeEnd("whileLoop");

console.time("sum");
resPool.resS = arr.sum();
console.timeEnd("sum");

console.time("foreach");
resPool.resE = arr.forEachTest();
console.timeEnd("foreach");

console.time("map");
resPool.resM = arr.mapTest();
console.timeEnd("map");

console.log("result: ", resPool);
