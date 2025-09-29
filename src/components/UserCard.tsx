import { forwardRef } from 'react';
import type { GitHubUser } from '../api/github';
import type { KeyboardEvent } from 'react';

interface UserCardProps {
  user: GitHubUser;
  onSelect: (user: GitHubUser) => void;
  isSelected: boolean;
  isFocused?: boolean;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const UserCard = forwardRef<HTMLDivElement, UserCardProps>((
  { user, onSelect, isSelected, isFocused, onKeyDown, onFocus, onBlur },
  ref
) => {
  const handleClick = () => {
    onSelect(user);
  };

  console.log('Rendering UserCard for:', user);

  return (
    <div
      ref={ref}
      className={`user-card ${isSelected ? 'selected' : ''} ${isFocused ? 'focused' : ''}`}
      onClick={handleClick}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      tabIndex={0}
      role="option"
      aria-selected={isSelected}
      aria-label={`User ${user.login}${user.name ? `, ${user.name}` : ''}.`}
    >
      <img
        src={user.avatar_url}
        alt={`${user.login}'s avatar`}
        className="user-avatar"
      />
      <h3 className="user-login">{user.login}</h3>
    </div>
  );
});

UserCard.displayName = 'UserCard';