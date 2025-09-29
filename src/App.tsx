import { useState, useCallback } from 'react';
import type { GitHubUser, GitHubRepository } from './api/github';
import { getUserRepositories } from './api/github';
import { UserSearch } from './components/UserSearch';
import { RepositoryList } from './components/RepositoryList';
import './App.css';

function App() {
  const [selectedUser, setSelectedUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [repositoriesLoading, setRepositoriesLoading] = useState(false);
  const [repositoriesError, setRepositoriesError] = useState<string | null>(null);

  const handleUserSelect = useCallback(async (user: GitHubUser) => {
    // Prevent duplicate requests for the same user
    if (selectedUser?.id === user.id && !repositoriesError) {
      return;
    }

    setSelectedUser(user);
    setRepositoriesLoading(true);
    setRepositoriesError(null);

    try {
      const repos = await getUserRepositories(user.login);
      setRepositories(repos);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      setRepositoriesError(`Failed to load repositories for ${user.login}. Please try again.`);
      setRepositories([]);
    } finally {
      setRepositoriesLoading(false);
    }
  }, [selectedUser, repositoriesError]);

  return (
    <div className="app">
      <UserSearch
        onUserSelect={handleUserSelect}
        selectedUser={selectedUser}
      />

      {selectedUser && (
        <RepositoryList
          repositories={repositories}
          username={selectedUser.login}
          loading={repositoriesLoading}
          error={repositoriesError}
          onRetry={() => handleUserSelect(selectedUser)}
        />
      )}
    </div>
  );
}

export default App;
