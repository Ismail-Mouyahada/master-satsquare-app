module.exports = {
  preset: "jest-puppeteer",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["<rootDir>/src/e2e/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["./jest.setup.js"], // Ajouter si vous avez un fichier de configuration setup
};
