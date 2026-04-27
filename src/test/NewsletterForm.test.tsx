import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewsletterForm from '@/components/NewsletterForm';

describe('NewsletterForm', () => {
  it('renders email input field', () => {
    render(<NewsletterForm />);
    expect(screen.getByPlaceholderText('ENTER YOUR EMAIL')).toBeInTheDocument();
  });

  it('renders subscribe button', () => {
    render(<NewsletterForm />);
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });

  it('shows error message when submitting empty form', async () => {
    render(<NewsletterForm />);
    const button = screen.getByRole('button', { name: /subscribe/i });
    await import('@testing-library/user-event').then(({ default: userEvent }) =>
      userEvent.click(button)
    );
    expect(await screen.findByText(/please enter/i)).toBeInTheDocument();
  });
});
