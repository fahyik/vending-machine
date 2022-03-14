module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  coverageDirectory: ".coverage",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/build/"],
  collectCoverage: true,
  collectCoverageFrom: ["./src/vending-machine/**/*.ts"],
};
