require("./iterator.js");

console.time("fib list")
var fib = fibonacci.createFibonacciList(77);
for (const fi of fib) {
    // console.log(fi);
}
console.timeEnd("fib list")

console.time("fib list simple")
var fib2 = fibonacci.createFibonacciListSimple();
for (let index = 0; index < 77; index++) {
    // console.log(fib2.next().value);
}
console.timeEnd("fib list simple")

console.time("fib appint slow")
console.log(fibonacci.fibonacciAppoint(30));
console.timeEnd("fib appint slow")

console.time("fib appint fast")
console.log(fibonacci.fibonacciAppointWithPhi(30));
console.timeEnd("fib appint fast")
