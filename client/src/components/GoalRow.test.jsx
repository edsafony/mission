import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import GoalRow from './GoalRow';

const goal = {
  id: 1,
  week_id: 1,
  role_id: 1,
  text: 'Read daily',
  tasks: [
    { id: 10, goal_id: 1, text: 'Read 20 pages', completed: 0 },
  ],
};

function setup(overrides = {}) {
  const props = {
    goal,
    onUpdate: vi.fn().mockResolvedValue({}),
    onDelete: vi.fn().mockResolvedValue({}),
    onTaskAdd: vi.fn().mockResolvedValue({}),
    onTaskUpdate: vi.fn().mockResolvedValue({}),
    onTaskDelete: vi.fn().mockResolvedValue({}),
    ...overrides,
  };
  render(<GoalRow {...props} />);
  return props;
}

describe('GoalRow', () => {
  test('renders goal text', () => {
    setup();
    expect(screen.getByText('Read daily')).toBeInTheDocument();
  });

  test('renders task items', () => {
    setup();
    expect(screen.getByText('Read 20 pages')).toBeInTheDocument();
  });

  test('clicking Edit shows an input pre-filled with goal text', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByDisplayValue('Read daily')).toBeInTheDocument();
  });

  test('clicking Save calls onUpdate with updated text', async () => {
    const onUpdate = vi.fn().mockResolvedValue({});
    setup({ onUpdate });
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.change(screen.getByDisplayValue('Read daily'), { target: { value: 'Read every morning' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(onUpdate).toHaveBeenCalledWith(1, 'Read every morning'));
  });

  test('clicking Delete calls onDelete with goal id', () => {
    const onDelete = vi.fn();
    setup({ onDelete });
    fireEvent.click(screen.getByRole('button', { name: /delete goal/i }));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  test('clicking "+ Add task" shows a task input form', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));
    expect(screen.getByPlaceholderText(/task description/i)).toBeInTheDocument();
  });

  test('shows task progress count', () => {
    const goalWithTasks = {
      ...goal,
      tasks: [
        { id: 10, goal_id: 1, text: 'Read 20 pages', completed: 1 },
        { id: 11, goal_id: 1, text: 'Take notes', completed: 0 },
      ],
    };
    setup({ goal: goalWithTasks });
    expect(screen.getByText(/1\/2/)).toBeInTheDocument();
  });

  test('submitting the task form calls onTaskAdd', async () => {
    const onTaskAdd = vi.fn().mockResolvedValue({});
    setup({ onTaskAdd });
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));
    fireEvent.change(screen.getByPlaceholderText(/task description/i), { target: { value: 'Read 30 pages' } });
    fireEvent.click(screen.getByRole('button', { name: /^add$/i }));
    await waitFor(() => expect(onTaskAdd).toHaveBeenCalledWith(1, 'Read 30 pages'));
  });
});
