import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchUsers, getUserRepositories, getUserDetails } from '../github';
import type { GitHubUser, GitHubRepository, GitHubSearchResponse } from '../github';

const mockUser: GitHubUser = {
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
};

const mockRepository: GitHubRepository = {
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
};

const mockSearchResponse: GitHubSearchResponse = {
  total_count: 1,
  incomplete_results: false,
  items: [mockUser],
};

describe('GitHub API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('searchUsers', () => {
    it('should return users when search is successful', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockSearchResponse,
      });
      globalThis.fetch = mockFetch;

      const result = await searchUsers('testuser');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/search/users?q=testuser&per_page=5'
      );
      expect(result).toEqual([mockUser]);
    });

    it('should return empty array when query is empty', async () => {
      const result = await searchUsers('');
      expect(result).toEqual([]);
    });

    it('should return empty array when query is only whitespace', async () => {
      const result = await searchUsers('   ');
      expect(result).toEqual([]);
    });

    it('should throw error when API request fails', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });
      globalThis.fetch = mockFetch;

      await expect(searchUsers('testuser')).rejects.toThrow('GitHub API error: 404');
    });

    it('should throw error when network request fails', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      globalThis.fetch = mockFetch;

      await expect(searchUsers('testuser')).rejects.toThrow('Network error');
    });

    it('should encode special characters in query', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockSearchResponse,
      });
      globalThis.fetch = mockFetch;

      await searchUsers('user@domain.com');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/search/users?q=user%40domain.com&per_page=5'
      );
    });
  });

  describe('getUserRepositories', () => {
    it('should return repositories when request is successful', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [mockRepository],
      });
      globalThis.fetch = mockFetch;

      const result = await getUserRepositories('testuser');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/users/testuser/repos?sort=updated&direction=desc'
      );
      expect(result).toEqual([mockRepository]);
    });

    it('should throw error when API request fails', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });
      globalThis.fetch = mockFetch;

      await expect(getUserRepositories('testuser')).rejects.toThrow('GitHub API error: 404');
    });

    it('should throw error when network request fails', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      globalThis.fetch = mockFetch;

      await expect(getUserRepositories('testuser')).rejects.toThrow('Network error');
    });
  });

  describe('getUserDetails', () => {
    it('should return user details when request is successful', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockUser,
      });
      globalThis.fetch = mockFetch;

      const result = await getUserDetails('testuser');

      expect(mockFetch).toHaveBeenCalledWith('https://api.github.com/users/testuser');
      expect(result).toEqual(mockUser);
    });

    it('should throw error when API request fails', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });
      globalThis.fetch = mockFetch;

      await expect(getUserDetails('testuser')).rejects.toThrow('GitHub API error: 404');
    });

    it('should throw error when network request fails', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      globalThis.fetch = mockFetch;

      await expect(getUserDetails('testuser')).rejects.toThrow('Network error');
    });
  });
});