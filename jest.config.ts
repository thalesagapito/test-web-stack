export default {
  coverageProvider: 'v8',
  moduleFileExtensions: [
    'js',
    'ts',
    'json',
    'vue',
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.vue$': 'vue3-jest',
  },
}
