import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import TaskItem from './TaskItem';

const task = { id: 1, goal_id: 1, text: 'Read 20 pages', completed: 0 };
const completedTask = { ...task, completed: 1 };

describe('TaskItem', () => {
  test('renders task text', () => {
    render(<TaskItem task={task} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Read 20 pages')).toBeInTheDocument();
  });

  test('renders an unchecked checkbox for incomplete task', () => {
    render(<TaskItem task={task} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  test('renders a checked checkbox for completed task', () => {
    render(<TaskItem task={completedTask} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('toggling checkbox calls onUpdate with flipped completed value', () => {
    const onUpdate = vi.fn();
    render(<TaskItem task={task} onUpdate={onUpdate} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onUpdate).toHaveBeenCalledWith(1, { completed: true });
  });

  test('toggling a completed task calls onUpdate with completed: false', () => {
    const onUpdate = vi.fn();
    render(<TaskItem task={completedTask} onUpdate={onUpdate} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onUpdate).toHaveBeenCalledWith(1, { completed: false });
  });

  test('completed task text has line-through style', () => {
    render(<TaskItem task={completedTask} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Read 20 pages')).toHaveClass('line-through');
  });

  test('calls onDelete with task id when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<TaskItem task={task} onUpdate={vi.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByLabelText(/delete task/i));
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
