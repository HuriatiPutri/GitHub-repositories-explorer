import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepositoryList } from '../RepositoryList';
import type { GitHubRepository } from '../../api/github';

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
  {
    id: 2,
    name: 'test-repo-2',
    full_name: 'testuser/test-repo-2',
    description: 'Second test repository',
    html_url: 'https://github.com/testuser/test-repo-2',
    stargazers_count: 10,
    forks_count: 3,
    language: 'JavaScript',
    updated_at: '2023-02-01T00:00:00Z',
    private: true,
  },
];

describe('RepositoryList', () => {
  const mockOnRetry = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state correctly', () => {
    render(
      <RepositoryList
        repositories={[]}
        username="testuser"
        loading={true}
      />
    );

    expect(screen.getByText('Loading repositories for testuser...')).toBeInTheDocument();
    expect(screen.getByText('Fetching repository data...')).toBeInTheDocument();
    expect(document.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  it('displays error state with retry button', () => {
    render(
      <RepositoryList
        repositories={[]}
        username="testuser"
        loading={false}
        error="Failed to load repositories"
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText("testuser's Repositories")).toBeInTheDocument();
    expect(screen.getByText('Failed to load repositories')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <RepositoryList
        repositories={[]}
        username="testuser"
        loading={false}
        error="Failed to load repositories"
        onRetry={mockOnRetry}
      />
    );

    const retryButton = screen.getByRole('button', { name: 'Try Again' });
    await user.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('displays error state without retry button when onRetry is not provided', () => {
    render(
      <RepositoryList
        repositories={[]}
        username="testuser"
        loading={false}
        error="Failed to load repositories"
      />
    );

    expect(screen.getByText('Failed to load repositories')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Try Again' })).not.toBeInTheDocument();
  });

  it('displays repositories correctly', () => {
    render(
      <RepositoryList
        repositories={mockRepositories}
        username="testuser"
        loading={false}
      />
    );

    expect(screen.getByText("testuser's Repositories (2)")).toBeInTheDocument();
    expect(screen.getByText('test-repo-1')).toBeInTheDocument();
    expect(screen.getByText('test-repo-2')).toBeInTheDocument();
  });

  it('displays no repositories message when array is empty', () => {
    render(
      <RepositoryList
        repositories={[]}
        username="testuser"
        loading={false}
      />
    );

    expect(screen.getByText("testuser's Repositories")).toBeInTheDocument();
    expect(screen.getByText('No public repositories found.')).toBeInTheDocument();
  });

  it('displays correct repository count', () => {
    render(
      <RepositoryList
        repositories={mockRepositories}
        username="testuser"
        loading={false}
      />
    );

    expect(screen.getByText("testuser's Repositories (2)")).toBeInTheDocument();
  });

  it('displays repository count for single repository', () => {
    render(
      <RepositoryList
        repositories={[mockRepositories[0]]}
        username="testuser"
        loading={false}
      />
    );

    expect(screen.getByText("testuser's Repositories (1)")).toBeInTheDocument();
  });

  it('handles different username correctly', () => {
    render(
      <RepositoryList
        repositories={mockRepositories}
        username="anotheruser"
        loading={false}
      />
    );

    expect(screen.getByText("anotheruser's Repositories (2)")).toBeInTheDocument();
  });

  it('has correct accessibility attributes for error message', () => {
    render(
      <RepositoryList
        repositories={[]}
        username="testuser"
        loading={false}
        error="Failed to load repositories"
        onRetry={mockOnRetry}
      />
    );

    const errorMessage = screen.getByText('Failed to load repositories');
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  it('renders repositories in a grid layout', () => {
    render(
      <RepositoryList
        repositories={mockRepositories}
        username="testuser"
        loading={false}
      />
    );

    const grid = document.querySelector('.repositories-grid');
    expect(grid).toBeInTheDocument();
    expect(grid?.children).toHaveLength(2);
  });
});