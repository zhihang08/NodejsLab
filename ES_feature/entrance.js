require("./iterator.js");


var indexs = [];
for (let index = 1; index < 11; index++) {
    indexs.push(index);
}

var fib = fibonacci.createFibonacci(indexs);

for (const fi of fib) {
    console.log(fi);
}

