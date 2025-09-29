import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import type { GitHubUser, GitHubRepository } from '../api/github';

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, {
    ...options,
  });
}

export const createMockUser = (overrides: Partial<GitHubUser> = {}): GitHubUser => ({
  id: 1,
  login: 'testuser',
  avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
  html_url: 'https://github.com/testuser',
  public_repos: 10,
  followers: 100,
  following: 50,
  name: 'Test User',
  bio: 'A test user for testing',
  company: 'Test Company',
  location: 'Test Location',
  ...overrides,
});

export const createMockRepository = (overrides: Partial<GitHubRepository> = {}): GitHubRepository => ({
  id: 1,
  name: 'test-repo',
  full_name: 'testuser/test-repo',
  description: 'A test repository',
  html_url: 'https://github.com/testuser/test-repo',
  stargazers_count: 5,
  forks_count: 2,
  language: 'TypeScript',
  updated_at: '2023-01-01T00:00:00Z',
  private: false,
  ...overrides,
});

export const createMockSearchResponse = (users: GitHubUser[]) => ({
  total_count: users.length,
  incomplete_results: false,
  items: users,
});

export const waitForDebounce = async (delay: number = 500) => {
  const { vi } = await import('vitest');
  vi.advanceTimersByTime(delay);
};

export function createDelayedPromise<T>(value: T, delay: number = 100): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), delay);
  });
}

export const createRejectedPromise = (message: string = 'Network error'): Promise<never> => {
  return Promise.reject(new Error(message));
};

export const testScenarios = {
  singleUser: [createMockUser()],
  multipleUsers: [
    createMockUser({ id: 1, login: 'user1', name: 'First User' }),
    createMockUser({ id: 2, login: 'user2', name: 'Second User' }),
    createMockUser({ id: 3, login: 'user3', name: 'Third User' }),
  ],
  userWithMinimalData: [createMockUser({ name: undefined, bio: undefined, company: undefined, location: undefined })],
  multipleRepositories: [
    createMockRepository({ id: 1, name: 'repo1', language: 'TypeScript', stargazers_count: 100 }),
    createMockRepository({ id: 2, name: 'repo2', language: 'JavaScript', stargazers_count: 50, private: true }),
    createMockRepository({ id: 3, name: 'repo3', language: 'Python', description: undefined }),
  ],
  emptyRepositories: [],
};

export const checkAccessibility = {
  hasAriaLabel: (element: Element, expectedLabel: string) => {
    return element.getAttribute('aria-label') === expectedLabel;
  },
  hasRole: (element: Element, expectedRole: string) => {
    return element.getAttribute('role') === expectedRole;
  },
  isKeyboardNavigable: (element: Element) => {
    const tabIndex = element.getAttribute('tabindex');
    return tabIndex === '0' || tabIndex === '-1' || element.tagName.toLowerCase() === 'button' || element.tagName.toLowerCase() === 'input';
  },
};

export const customMatchers = {
  toBeVisible: (element: Element) => (element as HTMLElement).offsetParent !== null,
  toHaveAriaSelected: (element: Element, selected: boolean) => {
    return element.getAttribute('aria-selected') === selected.toString();
  },
  toHaveClass: (element: Element, className: string) => {
    return element.classList.contains(className);
  },
};