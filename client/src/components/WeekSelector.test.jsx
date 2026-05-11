import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import WeekSelector from './WeekSelector';

const START_DATE = '2025-05-05'; // a Monday

describe('WeekSelector', () => {
  test('shows "This Week" label when offset is 0', () => {
    render(<WeekSelector startDate={START_DATE} offset={0} onPrev={vi.fn()} onNext={vi.fn()} />);
    expect(screen.getByText(/this week/i)).toBeInTheDocument();
  });

  test('does not show "This Week" when offset is non-zero', () => {
    render(<WeekSelector startDate={START_DATE} offset={1} onPrev={vi.fn()} onNext={vi.fn()} />);
    expect(screen.queryByText(/this week/i)).not.toBeInTheDocument();
  });

  test('shows formatted week date range', () => {
    render(<WeekSelector startDate={START_DATE} offset={0} onPrev={vi.fn()} onNext={vi.fn()} />);
    expect(screen.getByText(/may 5/i)).toBeInTheDocument();
    expect(screen.getByText(/may 11/i)).toBeInTheDocument();
  });

  test('calls onPrev when previous button is clicked', () => {
    const onPrev = vi.fn();
    render(<WeekSelector startDate={START_DATE} offset={0} onPrev={onPrev} onNext={vi.fn()} />);
    fireEvent.click(screen.getByLabelText(/previous week/i));
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  test('calls onNext when next button is clicked', () => {
    const onNext = vi.fn();
    render(<WeekSelector startDate={START_DATE} offset={0} onPrev={vi.fn()} onNext={onNext} />);
    fireEvent.click(screen.getByLabelText(/next week/i));
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
