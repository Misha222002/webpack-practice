async function start() {
  return await Promise.resolve("async is worcing");
}

start().then(console.log);

class Util {
  static id = Date.now();
}

console.log("Util id: ", Util.id);

import("lodash").then((_) => {
  console.log("Lodash", Math.random(0, 42, true));
});
