import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { searchUsers, getUserRepositories } from '../api/github';
import type { GitHubUser, GitHubRepository } from '../api/github';

// Mock the API
vi.mock('../api/github', () => ({
  searchUsers: vi.fn(),
  getUserRepositories: vi.fn(),
}));

const mockUsers: GitHubUser[] = [
  {
    id: 1,
    login: 'testuser',
    avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
    html_url: 'https://github.com/testuser',
    public_repos: 2,
    followers: 100,
    following: 50,
    name: 'Test User',
    bio: 'A test user for testing',
  },
];

const mockRepositories: GitHubRepository[] = [
  {
    id: 1,
    name: 'test-repo-1',
    full_name: 'testuser/test-repo-1',
    description: 'First test repository',
    html_url: 'https://github.com/testuser/test-repo-1',
    stargazers_count: 5,
    forks_count: 2,
    language: 'TypeScript',
    updated_at: '2023-01-01T00:00:00Z',
    private: false,
  },
];

describe('App', () => {
  const mockSearchUsers = vi.mocked(searchUsers);
  const mockGetUserRepositories = vi.mocked(getUserRepositories);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders app title', () => {
    render(<App />);
    expect(screen.getByText('GitHub Repository Explorer')).toBeInTheDocument();
  });

  it('shows initial search interface', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Enter username to search...')).toBeInTheDocument();
    expect(screen.getByText('Search for GitHub users and explore their repositories')).toBeInTheDocument();
  });

  it('shows repositories after user selection', async () => {
    mockSearchUsers.mockResolvedValue(mockUsers);
    mockGetUserRepositories.mockResolvedValue(mockRepositories);

    render(<App />);

    const input = screen.getByPlaceholderText('Enter username to search...');
    fireEvent.change(input, { target: { value: 'testuser' } });

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
    }, { timeout: 2000 });

    fireEvent.click(screen.getByText('testuser'));

    await waitFor(() => {
      expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('handles API errors gracefully', async () => {
    mockSearchUsers.mockRejectedValue(new Error('API Error'));

    render(<App />);

    const input = screen.getByPlaceholderText('Enter username to search...');
    fireEvent.change(input, { target: { value: 'testuser' } });

    await waitFor(() => {
      expect(screen.getByText('Error searching users. Please try again.')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});