import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/lib/AuthContext';
import { CartProvider } from '@/lib/CartContext';
import '@testing-library/jest-dom';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthProvider>
      <CartProvider>{ui}</CartProvider>
    </AuthProvider>
  );
};

describe('Navbar', () => {
  it('renders the Toyota Rigs logo text', () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText('Toyota Rigs')).toBeInTheDocument();
  });
});
