import '@testing-library/jest-dom';

// Mock environment variables for tests
Object.defineProperty(import.meta.env, 'VITE_DEEPSEEK_API_KEY', {
  value: 'test-api-key',
  writable: true,
});

Object.defineProperty(import.meta.env, 'VITE_DEEPSEEK_BASE_URL', {
  value: 'https://api.deepseek.com',
  writable: true,
});

// Mock localStorage for tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch for API tests
global.fetch = jest.fn();

// Mock mathjs for formula tests
jest.mock('mathjs', () => ({
  evaluate: jest.fn((formula) => {
    // Simple mock that returns 100 for any valid formula
    if (typeof formula === 'string' && formula.length > 0) {
      return 100;
    }
    throw new Error('Invalid formula');
  }),
})); 