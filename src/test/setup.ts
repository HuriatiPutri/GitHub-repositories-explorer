import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach } from 'vitest';

globalThis.fetch = vi.fn();

const originalConsole = { ...console };
beforeEach(() => {
  console.log = vi.fn();
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterEach(() => {
  Object.assign(console, originalConsole);
});

afterEach(() => {
  vi.clearAllMocks();
});