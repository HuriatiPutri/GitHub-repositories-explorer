const GITHUB_API_BASE = 'https://api.github.com';

export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  name?: string;
  bio?: string;
  company?: string;
  location?: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language?: string;
  updated_at: string;
  private: boolean;
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUser[];
}

export const searchUsers = async (query: string): Promise<GitHubUser[]> => {
  if (!query.trim()) {
    return [];
  }

  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/search/users?q=${encodeURIComponent(query)}&per_page=5`
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubSearchResponse = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

export const getUserRepositories = async (username: string): Promise<GitHubRepository[]> => {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&direction=desc`
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubRepository[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
};

export const getUserDetails = async (username: string): Promise<GitHubUser> => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}`);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubUser = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};