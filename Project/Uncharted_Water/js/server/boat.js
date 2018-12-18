class Boat {
  constructor(name, ori_name, ord_speed, str) {
    this.originalName = ori_name;
    this.stenth = str;
    this.currentSpeed = 0;
    this.ordinarySpeed =  ord_speed;
  }
  accelerate(speed, time) {
    //after accelerate time, speed decreace to the normal status gradually in 5s.
    setTimeout(() => {
      this._acTime = (parseInt(time))?parseInt(time):10;
      console.log("Boat accelerate " + speed + " in " + this._acTime + "s");
    },  this._acTime );
    return true;
  }
  revertAccelerate(speed, time) {
    if (speed & parseInt(speed)) {
      this._reTime = (parseInt(time))?parseInt(time):5;
      setTimeout(() => {
        this.speed -= speed;
        console.log("Boat deaccelerate " + speed + " in " + this._reTime + "s");
      },  this._reTime);
      return true;
    }
    return false;
  }
}

let dragonBoat = new Boat(100);
dragonBoat.accelerate(10, 10);
