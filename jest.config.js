module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  testMatch: ['<rootDir>/src/**/*.(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
};
