var ladderLength = (beginWord, endWord, wordList)=>{
    var count = 0;
    ladderCalculator.WordList = wordList;
    ladderCalculator.currentWord = beginWord;
    while(currentWord != endWord){
        ladderCalculator.ChangeWord();
    }
    return count;
};

var ladderCalculator = function(){
    return{
        WordList:null,
        currentWord:null,
        ChangeWord: (position, letter)=>{

        },
        CheckExist: (target)=>{
            ////Mapping plan
            // ladderCalculator.WordList.map((ele)=>{
            //     if(ele = target){
            //         return true;
            //     }
            // });
            // return false;

            //Array plan
            return ladderCalculator.WordList.includes(target);
        }
    }
}();

const bWord = "hit";
const endWord = "cog";
const wordList = ["hot","dot","dog","lot","log","cog"];

console.log(ladderLength(bWord, endWord, wordList));

