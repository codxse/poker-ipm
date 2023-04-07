module.exports = {
  moduleFileExtensions: [
    "js",
    "json",
    "ts"
  ],
  rootDir: ".",
  testMatch: ['<rootDir>/test/unit/**/*.spec.ts'],
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  collectCoverageFrom: [
    "**/*.(t|j)s"
  ],
  coverageDirectory: "test/coverage",
  testEnvironment: "node",
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
    '^@testhelper/(.*)$': '<rootDir>/test/_helpers/$1'
  },
}