module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ["**/*.{ts,tsx}", "!**/node_modules/**"],
    roots: ["<rootDir>/src"],
    testMatch: ["**/__tests__/**/*.+(ts|tsx)", "**/?(*.)+(test).+(ts|tsx)"],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
};
