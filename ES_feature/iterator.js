require("./main.js");
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
    *createFibonacci(array){
        for (let index = 0; index < array.length; index++) {
           (index <= 2)? yield 1 : yield array[index];
        }
    },
    //F(n)=F(n-1)+F(n-2)
    step(beforeN, aheadN, n){
        if (n < 3) {
            return 1;
        }
        return beforeN + aheadN;
    },

    run(taskDef){
        let task = taskDef();
        let result = task.next();
        function step() {
            if(!result.done){
                result = task.next({"n1": 1, "n2": 1});
                step();
            }
        }
        step();
    }
}