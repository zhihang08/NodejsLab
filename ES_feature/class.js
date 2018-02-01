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
    constructor(name, gender, age, instrument){
        super(name, gender, age);
        this.instrument = Object.keys(InstrumentList).find(k => (k === instrument));
    }
    playInstrument(target){
        console.log(this.name + " is playing " + target + " with " + this.instrument);
    }

    prepare(callback){
      super.sitdown();
      this.adjustInstrument();
      callback;
    }

    adjustInstrument(){
        var delayTime = Math.random() * 10;
        setTimeout(() => {
            console.log(this.name + " toke" + delayTime  + "s to finish adjust his/her instrument");
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
      main.makeid(main.numbers, 2),
      main.getKeyByValue(InstrumentList, main.makeid(main.numbers, 1))
    ))
}
//#endregion

console.time("=== Async class ===");
async.map(players, (player)=>{
    player.prepare(player.playInstrument("Mozart"));
}, (err, result)=>{});
console.timeEnd("=== Async class ===");
