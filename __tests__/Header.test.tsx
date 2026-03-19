import { render, screen } from '@testing-library/react';
import Header from '../app/components/Header';

// Mock the AuthProvider hook
jest.mock('../app/components/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

// Mock the CartProvider hook
jest.mock('../app/components/CartProvider', () => ({
  useCart: jest.fn(() => ({
    cart: null,
    openDrawer: jest.fn(),
  })),
}));

import { useAuth } from '../app/components/AuthProvider';

describe('Header', () => {
  it('shows "Sign In" when the user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });

    render(<Header />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('shows "Profile" when the user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
    });

    render(<Header />);

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });
});
