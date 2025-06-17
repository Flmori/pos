module.exports = {
  moduleNameMapper: {
    '^react-router-dom$': '<rootDir>/node_modules/react-router-dom',
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
