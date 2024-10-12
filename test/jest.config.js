// Log a message to remind developers how to see more detail from log messages
console.log(
  `Using LOG_LEVEL=${process.env.LOG_LEVEL}. Use 'debug' in env.jest for more detail`
);

// Set our Jest options, see https://jestjs.io/docs/configuration
module.exports = {
  verbose: true,
  testTimeout: 5000,
  coveragePathIgnorePatterns: [
    "/node_modules/*",
    "/test/httpParser.test.js", // ignore current tests
    "/test/index.html",
  ],
  setupFiles: ["./jest.setup.js"],
};
