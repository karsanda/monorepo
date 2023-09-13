/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  displayName: 'hackernews-react',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
};