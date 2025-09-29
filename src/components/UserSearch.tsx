import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { GitHubUser } from '../api/github';
import type { KeyboardEvent } from 'react';
import { searchUsers } from '../api/github';
import { UserCard } from './UserCard';

interface UserSearchProps {
  onUserSelect: (user: GitHubUser) => void;
  selectedUser: GitHubUser | null;
}

export const UserSearch: React.FC<UserSearchProps> = ({ onUserSelect, selectedUser }) => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedUserIndex, setFocusedUserIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const userRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setUsers([]);
      setError(null);
      setIsSearching(false);
      return;
    }

    setLoading(true);
    setIsSearching(true);
    setError(null);
    setFocusedUserIndex(-1);

    try {
      const results = await searchUsers(query);
      setUsers(results);
      userRefs.current = new Array(results.length).fill(null);
    } catch {
      setError('Error searching users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [query]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, handleSearch]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (users.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedUserIndex(prev => {
          const next = prev < users.length - 1 ? prev + 1 : 0;
          setTimeout(() => userRefs.current[next]?.focus(), 0);
          return next;
        });
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedUserIndex(prev => {
          const next = prev > 0 ? prev - 1 : users.length - 1;
          setTimeout(() => userRefs.current[next]?.focus(), 0);
          return next;
        });
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedUserIndex >= 0 && focusedUserIndex < users.length) {
          onUserSelect(users[focusedUserIndex]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setQuery('');
        setFocusedUserIndex(-1);
        inputRef.current?.focus();
        break;
    }
  };

  const handleUserKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    switch (event.key) {
      case 'Enter':
      case ' ': {
        event.preventDefault();
        onUserSelect(users[index]);
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex = index < users.length - 1 ? index + 1 : 0;
        setFocusedUserIndex(nextIndex);
        userRefs.current[nextIndex]?.focus();
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const prevIndex = index > 0 ? index - 1 : users.length - 1;
        setFocusedUserIndex(prevIndex);
        userRefs.current[prevIndex]?.focus();
        break;
      }
      case 'Escape': {
        event.preventDefault();
        setFocusedUserIndex(-1);
        inputRef.current?.focus();
        break;
      }
    }
  };

  const handleUserFocus = (index: number) => {
    setFocusedUserIndex(index);
  };

  const handleUserBlur = () => {
    setTimeout(() => {
      if (!userRefs.current.some(ref => ref === document.activeElement)) {
        setFocusedUserIndex(-1);
      }
    }, 0);
  };

  return (
    <div className="user-search">
      <div className="search-container">
        <h1>GitHub Repository Explorer</h1>
        <p>Search for GitHub users and explore their repositories</p>

        <div className="search-input-container">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter username to search..."
            className={`search-input ${loading ? 'loading' : ''}`}
            aria-label="Search GitHub users"
            aria-describedby={error ? 'search-error' : users.length > 0 ? 'search-results' : undefined}
            autoComplete="off"
            disabled={loading}
          />
          {loading && (
            <div className="search-loading" aria-label="Searching">
              <div className="spinner"></div>
            </div>
          )}
          {!loading && query && (
            <button
              className="clear-search"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              type="button"
            >
              ×
            </button>
          )}
        </div>

        {/* Keyboard shortcuts help */}
        {users.length > 0 && (
          <div className="keyboard-hints">
            Use ↑↓ arrows to navigate, Enter to select, Esc to clear
          </div>
        )}
      </div>

      {error && (
        <div className="error-message" id="search-error" role="alert" aria-live="polite">
          {error}
        </div>
      )}

      {users.length > 0 && (
        <div className="users-container">
          <h2 id="search-results" aria-live="polite">
            Search Results ({users.length} user{users.length !== 1 ? 's' : ''} found)
          </h2>
          <div className="users-grid" role="listbox" aria-label="Search results">
            {users.map((user, index) => (
              <UserCard
                key={user.id}
                user={user}
                onSelect={onUserSelect}
                isSelected={selectedUser?.id === user.id}
                isFocused={focusedUserIndex === index}
                onKeyDown={(event) => handleUserKeyDown(event, index)}
                onFocus={() => handleUserFocus(index)}
                onBlur={handleUserBlur}
                ref={(el) => {
                  userRefs.current[index] = el;
                }}
              />
            ))}
          </div>
        </div>
      )}

      {query.trim() && !loading && users.length === 0 && !error && !isSearching && (
        <div className="no-results" aria-live="polite">
          <p>No users found for "{query}". Try a different search term.</p>
        </div>
      )}
    </div>
  );
};