import { render, screen } from '@testing-library/react';
import Header from '../app/components/Header';
import { useSession } from 'next-auth/react';

// Mock the useSession hook
jest.mock('next-auth/react');

describe('Header', () => {
  it('shows "Sign In" when the user is not authenticated', () => {
    // Arrange
    (useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' });

    // Act
    render(<Header />);

    // Assert
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('shows "Profile" when the user is authenticated', () => {
    // Arrange
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Test User' } },
      status: 'authenticated',
    });

    // Act
    render(<Header />);

    // Assert
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });
});
