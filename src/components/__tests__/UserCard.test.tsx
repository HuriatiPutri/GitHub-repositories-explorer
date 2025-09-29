import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserCard } from '../UserCard';
import type { GitHubUser } from '../../api/github';

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

describe('UserCard', () => {
  const mockOnSelect = vi.fn();
  const mockOnKeyDown = vi.fn();
  const mockOnFocus = vi.fn();
  const mockOnBlur = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user information correctly', () => {
    render(
      <UserCard
        user={mockUser}
        onSelect={mockOnSelect}
        isSelected={false}
      />
    );

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByAltText("testuser's avatar")).toBeInTheDocument();
    expect(screen.getByRole('option')).toBeInTheDocument();
  });

  it('applies selected class when isSelected is true', () => {
    render(
      <UserCard
        user={mockUser}
        onSelect={mockOnSelect}
        isSelected={true}
      />
    );

    const userCard = screen.getByRole('option');
    expect(userCard).toHaveClass('selected');
    expect(userCard).toHaveAttribute('aria-selected', 'true');
  });

  it('applies focused class when isFocused is true', () => {
    render(
      <UserCard
        user={mockUser}
        onSelect={mockOnSelect}
        isSelected={false}
        isFocused={true}
      />
    );

    expect(screen.getByRole('option')).toHaveClass('focused');
  });

  it('calls onSelect when clicked', async () => {
    const user = userEvent.setup();
    render(
      <UserCard
        user={mockUser}
        onSelect={mockOnSelect}
        isSelected={false}
      />
    );

    const userCard = screen.getByRole('option');
    await user.click(userCard);

    expect(mockOnSelect).toHaveBeenCalledWith(mockUser);
  });

  it('calls onKeyDown when key is pressed', () => {
    render(
      <UserCard
        user={mockUser}
        onSelect={mockOnSelect}
        isSelected={false}
        onKeyDown={mockOnKeyDown}
      />
    );

    const userCard = screen.getByRole('option');
    fireEvent.keyDown(userCard, { key: 'Enter' });

    expect(mockOnKeyDown).toHaveBeenCalled();
  });

  it('calls onFocus when focused', () => {
    render(
      <UserCard
        user={mockUser}
        onSelect={mockOnSelect}
        isSelected={false}
        onFocus={mockOnFocus}
      />
    );

    const userCard = screen.getByRole('option');
    fireEvent.focus(userCard);

    expect(mockOnFocus).toHaveBeenCalled();
  });

  it('calls onBlur when focus is lost', () => {
    render(
      <UserCard
        user={mockUser}
        onSelect={mockOnSelect}
        isSelected={false}
        onBlur={mockOnBlur}
      />
    );

    const userCard = screen.getByRole('option');
    fireEvent.blur(userCard);

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('has correct accessibility attributes', () => {
    render(
      <UserCard
        user={mockUser}
        onSelect={mockOnSelect}
        isSelected={false}
      />
    );

    const userCard = screen.getByRole('option');
    expect(userCard).toHaveAttribute('tabIndex', '0');
    expect(userCard).toHaveAttribute('aria-label', 'User testuser, Test User.');
  });

  it('renders correctly without optional user properties', () => {
    const minimalUser: GitHubUser = {
      id: 1,
      login: 'testuser',
      avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
      html_url: 'https://github.com/testuser',
      public_repos: 10,
      followers: 100,
      following: 50,
    };

    render(
      <UserCard
        user={minimalUser}
        onSelect={mockOnSelect}
        isSelected={false}
      />
    );

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByAltText("testuser's avatar")).toBeInTheDocument();
  });

  it('displays correct aria-label without name', () => {
    const userWithoutName: GitHubUser = {
      id: 1,
      login: 'testuser',
      avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
      html_url: 'https://github.com/testuser',
      public_repos: 10,
      followers: 100,
      following: 50,
    };

    render(
      <UserCard
        user={userWithoutName}
        onSelect={mockOnSelect}
        isSelected={false}
      />
    );

    const userCard = screen.getByRole('option');
    expect(userCard).toHaveAttribute('aria-label', 'User testuser.');
  });
});