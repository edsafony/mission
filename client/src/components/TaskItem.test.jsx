import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import TaskItem from './TaskItem';

const task = { id: 1, goal_id: 1, text: 'Read 20 pages', completed: 0 };

describe('TaskItem', () => {
  test('renders task text', () => {
    render(<TaskItem task={task} onDelete={vi.fn()} />);
    expect(screen.getByText('Read 20 pages')).toBeInTheDocument();
  });

  test('calls onDelete with task id when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<TaskItem task={task} onDelete={onDelete} />);
    fireEvent.click(screen.getByLabelText(/delete task/i));
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
