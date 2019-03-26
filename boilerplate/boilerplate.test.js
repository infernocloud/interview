const boilerplate = require("./boilerplate");

test("says hello", () => {
    expect(boilerplate.hello()).toBe("Hello world");
});

test("returns object", () => {
    const testHelloObj = { hello: "Hello world" };
    expect(boilerplate.obj()).toEqual(testHelloObj);
});

// Skip other tests, only run this
// test.only("has 5 in array", () => {
//     expect(boilerplate.arr()).toContain(5);
// });

test("has 5 in array", () => {
    expect(boilerplate.arr()).toContain(5);
});

test("throws an error", () => {
    // Test that the err() function throws an exception and it contains the word "test"
    expect(boilerplate.err).toThrow();
});

// Scoped block of tests
describe("various methods to handle async functions", () => {
    // Waits for a promise to resolve, using then()
    // Must return the promise in the test() callback to make Jest wait for resolve
    test("waits for promise", () => {
        return boilerplate.asyncPromise().then(data => {
            expect(data).toBe("Times up");
        });
    });

    // Use async/await to handle async functions
    test("waits for promise (async/await)", async () => {
        const data = await boilerplate.asyncPromise();
        expect(data).toBe("Times up");
    });

    // Use Jest's built in resolves() function to handle async functions
    // Must return the assertion in the test() callback to make Jest wait for resolve
    test("waits for promise (.resolves())", () => {
        return expect(boilerplate.asyncPromise()).resolves.toBe("Times up");
    });

    // Use Jest's built in resolves() function and async/await instead of returning assetion to handle async functions
    // Must await the assertion in the test() callback to make Jest wait for resolve
    test("waits for promise (async/await .resolves())", async () => {
        await expect(boilerplate.asyncPromise()).resolves.toBe("Times up");
    });
});