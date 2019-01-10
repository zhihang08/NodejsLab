require("./main.js");
//Featrue part
iteratorPlayground = function(){
    return{
        types: ["math", "science", "pe"],
        initData: function(count = 100){
            iteratorPlayground.data = {
                allCategorys:{

                },
                getAllCategory: function(){
                    res = [];
                    iteratorPlayground.types.forEach(element => {
                        for (const data of this.allCategorys[element]) {
                            res.push(data);
                        }
                    });
                    return res;
                }
            }
                // [Symbol.iterator]() {
                //     return{
                //         next(){

                //         }
                //     }
                // };
            
            iteratorPlayground.types.forEach(element => {
                iteratorPlayground.data.allCategorys[element] = [];
                for (let index = 0; index < count; index++) {
                    iteratorPlayground.data.allCategorys[element].push(main.generateToken());
                }
            });
            
        },
        createIterator: function *() {
            yield 1;
            yield 2;
            yield 3;
        }
    }
}();

iteratorDemo = {
    *createIterator(item){
        for (let index = 0; index < item.length; index++) {
            yield item[index];
        }
    }
}

fibonacci = {
    *createFibonacciList(count){
        var target = [];
        for (let index = 0; index < count; index++) {
            index < 2 ? target[index] = 1 
            : target[index] = target[index - 1] + target[index - 2];
            yield target[index];
        }
    },
    *createFibonacciListSimple(){
        var current = a = b = 1;
        yield 1;
        while (true) {
          current = b;
          yield current;
          b = a + b;
          a = current;
        }
    },
    fibonacciAppoint(n){
        return n < 1 ? 0 
            : n < 2 ? 1 
            : fibonacci.fibonacciAppoint(n - 1) + fibonacci.fibonacciAppoint(n - 2);
    },
    fibonacciAppointWithPhi(n){
        //This is most efficient way to calculate fibonacci value, 
        //but it works correctly for not big values. 
        //For example it gives wrong value for fib(77). 
        //It gives 5527939700884755, but in fact it must be 5527939700884757.
        let phi = (1 + Math.sqrt(5))/2;
        let asymp = Math.pow(phi, n) / Math.sqrt(5);
        return Math.round(asymp);
    }
}

//Test part

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