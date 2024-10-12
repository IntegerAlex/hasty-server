const {
  findFirstBrac,
  HTTPbody,
  JSONbodyParser,
  queryParser,
  lookupMimeType,
} = require("../../lib/utils");

describe("findFirstBrac", () => {
  test("returns the correct index when the target is present", () => {
    expect(findFirstBrac("hello", "e")).toBe(1);
    expect(findFirstBrac("abcabc", "c")).toBe(2);
    expect(findFirstBrac(["a", "b", "c"], "b")).toBe(1);
  });

  test("returns -1 when the target is not present", () => {
    expect(findFirstBrac("hello", "z")).toBe(-1);
    expect(findFirstBrac(["x", "y", "z"], "a")).toBe(-1);
  });

  test("returns -1 for an empty array or string", () => {
    expect(findFirstBrac("", "a")).toBe(-1);
    expect(findFirstBrac([], "a")).toBe(-1);
  });

  test("returns the index of the first occurrence if multiple instances of the target are present", () => {
    expect(findFirstBrac("banana", "a")).toBe(1);
    expect(findFirstBrac(["a", "b", "a"], "a")).toBe(0);
  });

  test("handles different data types in the array", () => {
    expect(findFirstBrac([1, 2, 3], 2)).toBe(1);
    expect(findFirstBrac([true, false, true], false)).toBe(1);
    expect(findFirstBrac(["a", 2, {}], {})).toBe(-1); // Objects are reference types, so this returns -1.
  });
});
