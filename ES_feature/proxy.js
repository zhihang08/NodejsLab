//Simple get set
let handler = {
  get: (target, name)=> {
    return name in target ?
            target[name] :
            37;
  },
  set:(obj, prop, value)=>{
    if (prop == "userAge") {
      if (!Number.isInteger(value)) {
        throw new TypeError('The userAge should be integer');
      }
      if (value > 200 || value < 0) {
        throw new RangeError("The age should be reasonable");
      }
    }
  }
}
const proxy = new Proxy({}, handler);
proxy.a = 1;

proxy.b = undefined;
proxy.userAge = 100;
console.log(proxy.a, proxy.b);
console.log('c' in proxy, proxy.c);
console.log(proxy);
// proxy.userAge = 300;
// proxu.userAge = "test";


//proxy on change
function trackChange(obj, onChange) {
  const handler = {
    set(obj, prop, value){
      const oldVal = obj[prop];
      Reflect.set(obj, prop, value);
      onChange(obj, prop, oldVal, value);
    },
    deleteProperty (obj, prop) {
      const oldVal = obj[prop];
      Reflect.deleteProperty(obj, prop);
      onChange(obj, prop, oldVal, undefined);
    }
  }
  return new Proxy(obj, handler);
}

let myObj = trackChange({a:1, b:2}, (obj, prop, oldVal, newVal) => {
     console.log(`myObj.${prop} changed from ${oldVal} to ${newVal}`);
});
myObj.a = 5;
delete myObj.b;
myObj.c = 6;
