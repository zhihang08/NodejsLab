const express = require('express')
const app = express();
//1. Array json 
//2. Binary tree

//1+2+3+...100
const total = 11000;
var target = [];
for (let index = 0; index < total; index++) {
    target.push(1 * index);
}
function recursionFront(n){
    if(n == total - 1){
        return target[total - 1];
    }
    var currentNum = recursionFront(n + 1) + target[n];
    return currentNum;
}
function recursionBackend(n){
    if(n == 0){
        return target[0];
    }
    var currentNum = recursionBackend(n - 1) + target[n];
    return currentNum; 
}
function performence(target, args){
    var start = new Date();
    var result = target.apply(this, args);
    console.log(result);
    var end = new Date() - start;
    console.log("Span: " + end + "ms");
    return end;
}
function CrossPreasureTest(params) {
    
}
performence(recursionFront, [0]);
performence(recursionBackend, [total-1]);

app.listen(3009, () => console.log('Example app listening on port 3009!'))
