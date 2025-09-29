import React from 'react';
import type { GitHubRepository } from '../api/github';
import { RepositoryCard } from './RepositoryCard';

interface RepositoryListProps {
  repositories: GitHubRepository[];
  username: string;
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const RepositoryList: React.FC<RepositoryListProps> = ({
  repositories,
  username,
  loading,
  error,
  onRetry
}) => {
  if (loading) {
    return (
      <div className="repository-list">
        <h2>Loading repositories for {username}...</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Fetching repository data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="repository-list">
        <h2>{username}'s Repositories</h2>
        <div className="error-container">
          <div className="error-message" role="alert">
            {error}
          </div>
          {onRetry && (
            <button
              className="retry-button"
              onClick={onRetry}
              type="button"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  } if (repositories.length === 0) {
    return (
      <div className="repository-list">
        <h2>{username}'s Repositories</h2>
        <p className="no-repositories">No public repositories found.</p>
      </div>
    );
  }

  return (
    <div className="repository-list">
      <h2>{username}'s Repositories ({repositories.length})</h2>
      <div className="repositories-grid">
        {repositories.map((repo) => (
          <RepositoryCard key={repo.id} repository={repo} />
        ))}
      </div>
    </div>
  );
};