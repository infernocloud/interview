const hello = require("../index");

test("says hello", () => {
    expect(hello()).toBe("Hello world");
});