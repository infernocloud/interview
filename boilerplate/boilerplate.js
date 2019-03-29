const boilerplate = {
  hello() {
    return "Hello world";
  },
  obj() {
    return {
      hello: this.hello()
    };
  },
  arr() {
    return [1, 2, 3, 4, 5, 6];
  },
  err() {
    throw new Error("Expected test error");
  },
  asyncPromise() {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => resolve("Times up"), 500);
      } catch (e) {
        reject(new Error("Error"));
      }
    });
  }
};

module.exports = boilerplate;
