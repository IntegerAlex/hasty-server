module.exports = {
    preset: 'jest-preset-node',
    collectCoverage: true,
    coverageReporters: ['json', 'lcov', 'clover'],
    coverageDirectory: 'coverage',
  };