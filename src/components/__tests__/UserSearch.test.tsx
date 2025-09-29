import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserSearch } from '../UserSearch';
import { searchUsers } from '../../api/github';
import type { GitHubUser } from '../../api/github';

vi.mock('../../api/github', () => ({
  searchUsers: vi.fn(),
}));

const mockUsers: GitHubUser[] = [
  {
    id: 1,
    login: 'testuser1',
    avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
    html_url: 'https://github.com/testuser1',
    public_repos: 10,
    followers: 100,
    following: 50,
    name: 'Test User 1',
    bio: 'First test user',
  },
  {
    id: 2,
    login: 'testuser2',
    avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
    html_url: 'https://github.com/testuser2',
    public_repos: 5,
    followers: 50,
    following: 25,
    name: 'Test User 2',
    bio: 'Second test user',
  },
];

describe('UserSearch', () => {
  const mockOnUserSelect = vi.fn();
  const mockSearchUsers = vi.mocked(searchUsers);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input', () => {
    render(<UserSearch onUserSelect={mockOnUserSelect} selectedUser={null} />);
    expect(screen.getByPlaceholderText('Enter username to search...')).toBeInTheDocument();
  });

  it('shows initial state', () => {
    render(<UserSearch onUserSelect={mockOnUserSelect} selectedUser={null} />);
    expect(screen.getByText('Search for GitHub users and explore their repositories')).toBeInTheDocument();
  });

  it('calls onUserSelect when user is clicked', async () => {
    mockSearchUsers.mockResolvedValue(mockUsers);

    render(<UserSearch onUserSelect={mockOnUserSelect} selectedUser={null} />);
    const input = screen.getByPlaceholderText('Enter username to search...');

    fireEvent.change(input, { target: { value: 'testuser' } });

    await waitFor(() => {
      expect(screen.getByText('testuser1')).toBeInTheDocument();
    }, { timeout: 2000 });

    fireEvent.click(screen.getByText('testuser1'));
    expect(mockOnUserSelect).toHaveBeenCalledWith(mockUsers[0]);
  });

  it('displays error on search failure', async () => {
    mockSearchUsers.mockRejectedValue(new Error('API Error'));

    render(<UserSearch onUserSelect={mockOnUserSelect} selectedUser={null} />);
    const input = screen.getByPlaceholderText('Enter username to search...');

    fireEvent.change(input, { target: { value: 'testuser' } });

    await waitFor(() => {
      expect(screen.getByText('Error searching users. Please try again.')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('searches for single character queries', async () => {
    mockSearchUsers.mockResolvedValue([]);

    render(<UserSearch onUserSelect={mockOnUserSelect} selectedUser={null} />);
    const input = screen.getByPlaceholderText('Enter username to search...');

    fireEvent.change(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(mockSearchUsers).toHaveBeenCalledWith('a');
    }, { timeout: 1000 });
  });
});