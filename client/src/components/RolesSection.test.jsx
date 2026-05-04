import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import RolesSection from './RolesSection';

vi.mock('../hooks/useRoles', () => ({
  default: vi.fn(),
}));

import useRoles from '../hooks/useRoles';

const mockRoles = [
  { id: 1, name: 'Father', description: 'Family' },
  { id: 2, name: 'Professional', description: null },
];

function setupMock({ roles = mockRoles, add = vi.fn(), update = vi.fn(), remove = vi.fn() } = {}) {
  useRoles.mockReturnValue({ roles, add, update, remove });
}

describe('RolesSection', () => {
  test('renders a list of role cards when roles exist', () => {
    setupMock();
    render(<RolesSection />);
    expect(screen.getByText('Father')).toBeInTheDocument();
    expect(screen.getByText('Professional')).toBeInTheDocument();
  });

  test('renders empty state when no roles exist', () => {
    setupMock({ roles: [] });
    render(<RolesSection />);
    expect(screen.getByText(/no roles/i)).toBeInTheDocument();
  });

  test('add form: submitting with name calls add', async () => {
    const add = vi.fn().mockResolvedValue({});
    setupMock({ add });
    render(<RolesSection />);

    fireEvent.change(screen.getByPlaceholderText(/role name/i), { target: { value: 'Athlete' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => expect(add).toHaveBeenCalledWith('Athlete', ''));
  });

  test('add form: clears inputs after successful submit', async () => {
    const add = vi.fn().mockResolvedValue({});
    setupMock({ add });
    render(<RolesSection />);

    const nameInput = screen.getByPlaceholderText(/role name/i);
    fireEvent.change(nameInput, { target: { value: 'Athlete' } });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => expect(nameInput.value).toBe(''));
  });

  test('add form: does not call add when name is empty', () => {
    const add = vi.fn();
    setupMock({ add });
    render(<RolesSection />);

    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(add).not.toHaveBeenCalled();
  });
});
