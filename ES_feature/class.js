var async = require("async");
require("./main.js");
//#region Defination
let NotationList = [];
let players = [];
class Person {
  constructor(name, gender, age) {
    this.name = name;
    this.gender = gender;
    this.gender = age;
  }
  study(){

  }
  sitdown(){

  }
}
class Musician extends Person {
    constructor(name, gender, age, instrument, target){
        super(name, gender, age);
        this.target = target;
        this.instrument = Object.keys(InstrumentList).find(k => (k === instrument));
    }

    sitdown(){
      console.log(this.name + " is sit.");
    }

    playInstrument(){
        console.log(this.name + " is playing " + this.target + " with " + this.instrument);
    }

    prepare(callback){
      this.sitdown();
      var delayTime =  main.randomNum(0, 10);
      this.adjustInstrument(delayTime, callback);
    }

    adjustInstrument(delayTime, callback){
        setTimeout(() => {
            console.log(this.name + " toke " + delayTime  + "s to finish adjust his/her instrument");
            callback();
          },  delayTime);
        
    }
}
class Notation{
  constructor(name, ...rest){
    this.name = name;
    this.author = (rest[0])?rest[0]:"";
    this.band = (rest[1])?rest[1]:"";
    this.category = (rest[2])?rest[2]:"";
  }
}
const InstrumentList = {
    "Violin": 0,
    "Piano": 1,
    "Guitar": 2,
    "Keyboard": 3,
    "Drum": 4,
    "Horn": 5,
    "Tuba": 6,
    "Bassoon": 7,
    "Clarinet": 8,
    "Bass": 9
}
const MusicList = {
  "Mozart": 0,
  "Suspirium": 1,
  "Honey": 2,
  "Shallow": 3,
  "Venice_Bitch": 4,
  "Bag_Talk": 5,
  "HIGH": 6,
  "SUSPIRIUM": 7,
  "MISSING_U": 8,
  "IT_GETS_BETTER": 9
}
for (var i = 0; i < 10; i++) {
  NotationList.push(new Notation(
    main.makeid(main.characters, 4),
    main.makeid(main.characters, 4),
    null,
    main.makeid(main.characters, 2)
  ));
}
for (var i = 0; i < 100; i++) {
  players.push(
    new Musician(
      main.makeid(main.characters, 4),
      main.makeid(main.genders, 1),
      main.makeid(main.numbers, 2),
      main.getKeyByValue(InstrumentList, main.makeid(main.numbers, 1)),
      main.getKeyByValue(MusicList, main.makeid(main.numbers, 1)),
    ))
}
//#endregion

console.time("=== Async class ===");
async.map(players, (player)=>{
    player.prepare(function(){
      player.playInstrument()
    });
}, (err, result)=>{
  console.log(err, result);
});
console.timeEnd("=== Async class ===");
