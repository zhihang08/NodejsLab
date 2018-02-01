//Map focus on each element in an Array
//Reduce use every element and previous result in array for a single result


//#region Fundamental Data
console.time("Generate Fundamental Data");
var Course = ["English","Math","PE"]
const StudentScholars = {
  "DetailScore": [],
  "Analyze":{}
},
characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
numbers = "0123456789";

function makeid(pool, targetLength = 5) {
  var text = "";
  for (var i = 0; i < targetLength; i++)
    text += pool.charAt(Math.floor(Math.random() * pool.length));
  return text;
};
for (let i = 0; i < 500000; i++) {
  StudentScholars.DetailScore.push({
    "Name": makeid(characters),
    "Grade": makeid(numbers, 1),
    "Math": makeid(numbers, 2),
    "English": makeid(numbers, 2),
    "PE": makeid(numbers, 2),
  });
}
console.timeEnd("Generate Fundamental Data");
//#endregion

//#region Define basic function
Array.prototype.Sum = function() {
  return this.reduce((preValue, curValue) => {
    return preValue + curValue;
  })
}

//#endregion

//#region Features 
let Scholar = function(){
  return{
    GetIndex: function(target){
      return Object.keys(target);
    },
    GetScoreByCategory: function(category) {
      return StudentScholars.DetailScore.map((student) => {
        return parseInt(student[category])
      });
    },
    CalculateTotalAndAvg: function () {
      return Course.map((category) => {
        let target = Scholar.GetScoreByCategory(category);
        StudentScholars.Analyze[category + "_Total"] = target.Sum();
        StudentScholars.Analyze[category + "_Avg"] = StudentScholars.Analyze[category + "_Total"]/target.length;
      });
    },   
  }
}();
//#endregion

console.time("CalculateAvg");
console.log(typeof(StudentScholars.DetailScore[0]));
Course = (typeof(StudentScholars.DetailScore[0]) == "object")
      ?Scholar.GetIndex(StudentScholars.DetailScore[0])
      :Course;
Scholar.CalculateTotalAndAvg();
console.timeEnd("CalculateAvg");

console.log("=== Result: ===")
console.log(StudentScholars.Analyze);
