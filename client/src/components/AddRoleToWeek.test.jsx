import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import AddRoleToWeek from './AddRoleToWeek';

const roles = [
  { id: 1, name: 'Father' },
  { id: 2, name: 'Professional' },
];

function setup(overrides = {}) {
  const props = {
    roles,
    weekId: 10,
    onGoalAdd: vi.fn().mockResolvedValue({}),
    ...overrides,
  };
  render(<AddRoleToWeek {...props} />);
  return props;
}

describe('AddRoleToWeek', () => {
  test('renders the add button by default', () => {
    setup();
    expect(screen.getByRole('button', { name: /add role to this week/i })).toBeInTheDocument();
  });

  test('clicking the button shows the form with role options', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /add role to this week/i }));
    expect(screen.getByText('Father')).toBeInTheDocument();
    expect(screen.getByText('Professional')).toBeInTheDocument();
  });

  test('submitting with role and goal calls onGoalAdd', async () => {
    const onGoalAdd = vi.fn().mockResolvedValue({});
    setup({ onGoalAdd });
    fireEvent.click(screen.getByRole('button', { name: /add role to this week/i }));

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    fireEvent.change(screen.getByPlaceholderText(/first goal/i), { target: { value: 'Be present' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));

    await waitFor(() => expect(onGoalAdd).toHaveBeenCalledWith(10, 1, 'Be present'));
  });

  test('cancel hides the form', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /add role to this week/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.getByRole('button', { name: /add role to this week/i })).toBeInTheDocument();
  });

  test('does not call onGoalAdd when role is not selected', async () => {
    const onGoalAdd = vi.fn();
    setup({ onGoalAdd });
    fireEvent.click(screen.getByRole('button', { name: /add role to this week/i }));
    fireEvent.change(screen.getByPlaceholderText(/first goal/i), { target: { value: 'Be present' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    expect(onGoalAdd).not.toHaveBeenCalled();
  });
});
