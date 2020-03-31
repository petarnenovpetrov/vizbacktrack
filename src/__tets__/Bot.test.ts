import Bot from "../Bot";

describe("Bot class", () => {
  it("Should generate number between [5,20] 1000 times", () => {
    const lowBound = 5;
    const highBound = 20;
    for (let i = 0; i < 1000; i++) {
      const generatedNumber = Bot.randomInRange(lowBound, highBound);
      expect(generatedNumber).not.toBeNaN();
      expect(generatedNumber).toBeLessThanOrEqual(highBound);
      expect(generatedNumber).toBeGreaterThanOrEqual(lowBound);
    }
  }, 30000);
  // it("Should stringify array with objects", () => {
  //   const arr = [{ name: "Ali", age: 23 }];
  //   const result = Bot.stringifyArray(arr);
  //   expect(result).toEqual('{"name":"Ali","age":23}');
  // });
});
