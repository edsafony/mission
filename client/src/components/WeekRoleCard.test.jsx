import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('./GoalRow', () => ({
  default: ({ goal, onDelete }) => (
    <div data-testid="goal-row">
      {goal.text}
      <button onClick={() => onDelete(goal.id)}>Delete goal</button>
    </div>
  ),
}));

import WeekRoleCard from './WeekRoleCard';

const goals = [
  { id: 1, text: 'Read daily', tasks: [] },
  { id: 2, text: 'Exercise', tasks: [] },
];

function setup(overrides = {}) {
  const props = {
    roleId: 1,
    roleName: 'Father',
    goals,
    weekId: 10,
    onGoalAdd: vi.fn().mockResolvedValue({}),
    onGoalUpdate: vi.fn().mockResolvedValue({}),
    onGoalDelete: vi.fn().mockResolvedValue({}),
    onTaskAdd: vi.fn().mockResolvedValue({}),
    onTaskUpdate: vi.fn().mockResolvedValue({}),
    onTaskDelete: vi.fn().mockResolvedValue({}),
    ...overrides,
  };
  render(<WeekRoleCard {...props} />);
  return props;
}

describe('WeekRoleCard', () => {
  test('renders role name', () => {
    setup();
    expect(screen.getByText('Father')).toBeInTheDocument();
  });

  test('renders a GoalRow for each goal', () => {
    setup();
    expect(screen.getAllByTestId('goal-row')).toHaveLength(2);
  });

  test('clicking "+ Add goal" shows an input', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /add goal/i }));
    expect(screen.getByPlaceholderText(/goal description/i)).toBeInTheDocument();
  });

  test('submitting add goal form calls onGoalAdd with weekId and roleId', async () => {
    const onGoalAdd = vi.fn().mockResolvedValue({});
    setup({ onGoalAdd });
    fireEvent.click(screen.getByRole('button', { name: /add goal/i }));
    fireEvent.change(screen.getByPlaceholderText(/goal description/i), { target: { value: 'Sleep well' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    await waitFor(() => expect(onGoalAdd).toHaveBeenCalledWith(10, 1, 'Sleep well'));
  });

  test('cancel hides the add goal form', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /add goal/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByPlaceholderText(/goal description/i)).not.toBeInTheDocument();
  });
});
