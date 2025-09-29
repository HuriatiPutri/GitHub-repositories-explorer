import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RepositoryCard } from '../RepositoryCard';
import type { GitHubRepository } from '../../api/github';

const mockRepository: GitHubRepository = {
  id: 1,
  name: 'test-repo',
  full_name: 'testuser/test-repo',
  description: 'A test repository for testing',
  html_url: 'https://github.com/testuser/test-repo',
  stargazers_count: 5,
  forks_count: 2,
  language: 'TypeScript',
  updated_at: '2023-01-01T00:00:00Z',
  private: false,
};

describe('RepositoryCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders repository information correctly', () => {
    render(<RepositoryCard repository={mockRepository} />);

    expect(screen.getByText('test-repo')).toBeInTheDocument();
    expect(screen.getByText('A test repository for testing')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByTestId('star-count')).toHaveTextContent('5');
    expect(screen.getByTestId('fork-count')).toHaveTextContent('2');
  });

  it('renders repository link correctly', () => {
    render(<RepositoryCard repository={mockRepository} />);

    const link = screen.getByRole('link', { name: 'test-repo' });
    expect(link).toHaveAttribute('href', 'https://github.com/testuser/test-repo');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('displays private badge for private repositories', () => {
    const privateRepo = { ...mockRepository, private: true };
    render(<RepositoryCard repository={privateRepo} />);

    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('does not display private badge for public repositories', () => {
    render(<RepositoryCard repository={mockRepository} />);

    expect(screen.queryByText('Private')).not.toBeInTheDocument();
  });

  it('renders correctly without description', () => {
    const repoWithoutDescription = { ...mockRepository, description: undefined };
    render(<RepositoryCard repository={repoWithoutDescription} />);

    expect(screen.getByText('test-repo')).toBeInTheDocument();
    expect(screen.queryByText('A test repository for testing')).not.toBeInTheDocument();
  });

  it('renders correctly without language', () => {
    const repoWithoutLanguage = { ...mockRepository, language: undefined };
    render(<RepositoryCard repository={repoWithoutLanguage} />);

    expect(screen.getByText('test-repo')).toBeInTheDocument();
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
  });

  it('formats date correctly', () => {
    render(<RepositoryCard repository={mockRepository} />);

    expect(screen.getByText(/Updated/)).toBeInTheDocument();
    expect(screen.getByText(/1\/1\/2023|2023|Jan/)).toBeInTheDocument();
  });

  it('displays language color dot when language is present', () => {
    render(<RepositoryCard repository={mockRepository} />);

    const languageDot = document.querySelector('.language-dot');
    expect(languageDot).toBeInTheDocument();
    expect(languageDot).toHaveStyle('background-color: #2b7489');
  });

  it('uses default color for unknown language', () => {
    const repoWithUnknownLanguage = { ...mockRepository, language: 'UnknownLanguage' };
    render(<RepositoryCard repository={repoWithUnknownLanguage} />);

    const languageDot = document.querySelector('.language-dot');
    expect(languageDot).toBeInTheDocument();
    expect(languageDot).toHaveStyle('background-color: #586069');
  });

  it('displays zero stats correctly', () => {
    const repoWithZeroStats = {
      ...mockRepository,
      stargazers_count: 0,
      forks_count: 0,
    };
    render(<RepositoryCard repository={repoWithZeroStats} />);

    expect(screen.getByTestId('star-count')).toHaveTextContent('0');
    expect(screen.getByTestId('fork-count')).toHaveTextContent('0');
  });

  it('handles large numbers correctly', () => {
    const repoWithLargeStats = {
      ...mockRepository,
      stargazers_count: 1234,
      forks_count: 567,
    };
    render(<RepositoryCard repository={repoWithLargeStats} />);

    expect(screen.getByTestId('star-count')).toHaveTextContent('1234');
    expect(screen.getByTestId('fork-count')).toHaveTextContent('567');
  });
});