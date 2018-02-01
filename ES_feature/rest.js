//#region Rest 
var testRest = function(){
    function RestInput(parms1, parms2, ...rest){
        console.log("Normal Input: ", parms1, parms2)
        console.log("Rest parameters: ", ...rest);
        console.log("Specify: ", Object.keys(rest), rest[0]);
        
    }
    RestInput(1, 2, "What your new parameters", 3, 4, 5, {"Categorys":0},[99, 98, 97]);
}

//#endregion

//#region Assgin
var testAssgin = function(){
    const userData= {name: "Wolf", age: 22}
    const userDataDump = Object.assign({}, userData);
    userDataDump.name = "Snow";
    userDataDump.age = 28;
    console.log(userData);
    
    const userCopy = userData;
    userCopy.name = "John";
    userCopy.age = 26;
    console.log(userData);

    const Detail = Object.assign({tester: "user", objective: "final target"}, userData);
    const result = Object.assign({original: "Placeholder"}, Detail, userDataDump);
    console.log(result);
}
//#endregion
console.log("======= REST TEST =========");
testRest();
console.log("======= ASSIGN TEST =========");
testAssgin();