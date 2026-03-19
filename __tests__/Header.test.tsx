import { render, screen } from '@testing-library/react';
import Header from '../app/components/Header';

// Mock the CartProvider hook
jest.mock('../app/components/CartProvider', () => ({
  useCart: jest.fn(() => ({
    cart: null,
    openDrawer: jest.fn(),
  })),
}));

describe('Header', () => {
  it('renders the logo and navigation links', () => {
    render(<Header />);

    expect(screen.getByText('LABEL N')).toBeInTheDocument();
    expect(screen.getByText('Shop')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('shows Made to Order link', () => {
    render(<Header />);

    expect(screen.getAllByText('Made to Order').length).toBeGreaterThan(0);
  });
});
