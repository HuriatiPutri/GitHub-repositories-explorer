import React from 'react';
import type { GitHubRepository } from '../api/github';
import { getLanguageColor } from '../utils/function';
import { IconGitFork, IconStarFilled } from '@tabler/icons-react';

interface RepositoryCardProps {
  repository: GitHubRepository;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="repository-card">
      <div className="repository-header">
        <h3 className="repository-name">
          <a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="repository-link"
          >
            {repository.name}
          </a>
        </h3>
        {repository.private && <span className="private-badge">Private</span>}
      </div>

      {repository.description && (
        <p className="repository-description">{repository.description}</p>
      )}

      <div className="repository-stats">
        {repository.language && (
          <span className="stat language">
            <span className="language-dot" style={{ backgroundColor: getLanguageColor(repository.language) }}></span>
            {repository.language}
          </span>
        )}
        <span className="stat" data-testid="star-count">
          <IconStarFilled size={16} /> {repository.stargazers_count}
        </span>
        <span className="stat" data-testid="fork-count">
          <IconGitFork size={16} /> {repository.forks_count}
        </span>
        <span className="stat">
          Updated {formatDate(repository.updated_at)}
        </span>
      </div>
    </div>
  );
};
