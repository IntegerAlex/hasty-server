const {
  findFirstBrac,
  HTTPbody,
  JSONbodyParser,
  queryParser,
  lookupMimeType,
} = require("../../lib/utils");

describe("utils.test.js", () => {
  //   findFirstBrac
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

  //   HTTPBody
  describe("HTTPbody", () => {
    test("returns the body starting from the given position", async () => {
      const req = 'some random text { "key": "value" } more text';
      const pos = 17; // Position where the body starts
      const result = await HTTPbody(req, pos);
      expect(result).toBe('{ "key": "value" }');
    });

    test("correctly balances nested braces", async () => {
      const req = 'before { "nested": { "key": "value" } } after';
      const pos = 7; // Position where the outer body starts
      const result = await HTTPbody(req, pos);
      expect(result).toBe('{ "nested": { "key": "value" } }');
    });

    test("returns an empty object if no braces are found", async () => {
      const req = "no json body here";
      const pos = 0;
      const result = await HTTPbody(req, pos);
      expect(result).toBe("");
    });

    test("handles extra whitespace around the body", async () => {
      const req = '  \n   { "key": "value" }    \n';
      const pos = 3; // Starting after leading whitespace
      const result = await HTTPbody(req, pos);
      expect(result).toBe('{ "key":"value" }');
    });

    test("handles multiple body parts in the request", async () => {
      const req = 'part1 { "first": "body" } part2 { "second": "body" }';
      const pos = 6; // Position to start from the first body
      const result = await HTTPbody(req, pos);
      expect(result).toBe('{ "first":"body" }');
    });

    test("handles deeply nested JSON bodies", async () => {
      const req =
        'text { "deep": { "nested": { "json": "structure" } } } more text';
      const pos = 5; // Position where the outer body starts
      const result = await HTTPbody(req, pos);
      expect(result).toBe('{ "deep": { "nested": { "json":"structure" } } }');
    });
  });

  // JSONbodyParser
  describe("JSONbodyParser", () => {
    test("returns an empty object for empty input", () => {
      expect(JSONbodyParser("")).toEqual({});
    });

    test("parses a simple JSON-like string", () => {
      const input = "{a:b}";
      expect(JSONbodyParser(input)).toEqual({ a: "b" });
    });

    test("handles multiple pairs", () => {
      const input = "{a:b,c:d}";
      expect(JSONbodyParser(input)).toEqual({ a: "b", c: "d" });
    });

    test("ignores spaces between pairs", () => {
      const input = "{ a : b , c : d }";
      expect(JSONbodyParser(input)).toEqual({ a: "b", c: "d" });
    });

    test("handles nested structures", () => {
      const input = "{a:{b:c}}"; // This will depend on the behavior of storePair
      expect(JSONbodyParser(input)).toEqual({ a: { b: "c" } });
    });

    test("handles unbalanced braces", () => {
      const input = "{a:b,{c:d}"; // Assuming this will not throw and return empty
      expect(JSONbodyParser(input)).toEqual({});
    });

    test("handles incorrect input gracefully", () => {
      const input = "abc"; // Non-JSON input
      expect(JSONbodyParser(input)).toEqual({});
    });
  });

  //   queryParser
  describe("queryParser", () => {
    test("returns an empty object for a request without query parameters", () => {
      const request = "GET /path HTTP/1.1";
      expect(queryParser(request)).toEqual({});
    });

    test("parses a single query parameter correctly", () => {
      const request = "GET /path?name=John HTTP/1.1";
      expect(queryParser(request)).toEqual({ name: "John" });
    });

    test("parses multiple query parameters correctly", () => {
      const request = "GET /path?name=John&age=30 HTTP/1.1";
      expect(queryParser(request)).toEqual({ name: "John", age: "30" });
    });

    test("handles empty values for query parameters", () => {
      const request = "GET /path?name=&age=30 HTTP/1.1";
      expect(queryParser(request)).toEqual({ name: "", age: "30" });
    });

    test("handles query parameters without values", () => {
      const request = "GET /path?name&age HTTP/1.1";
      expect(queryParser(request)).toEqual({ name: "", age: "" });
    });

    test("handles encoded characters in query parameters", () => {
      const request = "GET /path?name=John%20Doe&city=New%20York HTTP/1.1";
      expect(queryParser(request)).toEqual({
        name: "John Doe",
        city: "New York",
      });
    });

    test("ignores malformed query parameters", () => {
      const request = "GET /path?=value&key HTTP/1.1";
      expect(queryParser(request)).toEqual({ key: "" });
    });
  });

  //   lookupMimeType
  describe("lookupMimeType", () => {
    test("returns correct MIME type for jpg extension", () => {
      expect(lookupMimeType("jpg")).toBe("image/jpeg");
    });

    test("returns correct MIME type for jpeg extension", () => {
      expect(lookupMimeType("jpeg")).toBe("image/jpeg");
    });

    test("returns correct MIME type for png extension", () => {
      expect(lookupMimeType("png")).toBe("image/png");
    });

    test("returns correct MIME type for html extension", () => {
      expect(lookupMimeType("html")).toBe("text/html");
    });

    test("returns correct MIME type for json extension", () => {
      expect(lookupMimeType("json")).toBe("application/json");
    });

    test("returns default MIME type for unknown extension", () => {
      expect(lookupMimeType("unknown")).toBe("application/octet-stream");
    });

    test("returns default MIME type for empty extension", () => {
      expect(lookupMimeType("")).toBe("application/octet-stream");
    });

    test("returns default MIME type for undefined extension", () => {
      expect(lookupMimeType(undefined)).toBe("application/octet-stream");
    });
  });
});
