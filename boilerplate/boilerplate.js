const boilerplate = {
    hello () {
        return "Hello world";
    },
    obj () {
        return {
            hello: this.hello()
        }
    },
    arr () {
        return [1,2,3,4,5,6];
    },
    err () {
        throw new Error("Expected test error");
    },
    asyncPromise () {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve("Times up"), 500);
            // setTimeout(() => reject("Error"), 500);
        });
    },
};

module.exports = boilerplate;