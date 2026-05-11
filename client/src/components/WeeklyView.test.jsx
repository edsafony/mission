import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('../hooks/useWeeks', () => ({ default: vi.fn() }));
vi.mock('./MissionBanner', () => ({ default: () => <div>Mission Banner</div> }));
vi.mock('./WeekSelector', () => ({
  default: ({ startDate }) => <div data-testid="week-selector">{startDate}</div>,
}));

import WeeklyView from './WeeklyView';
import useWeeks from '../hooks/useWeeks';

function setup(weekValue) {
  useWeeks.mockReturnValue({
    week: weekValue,
    startDate: '2025-05-05',
    offset: 0,
    goToPrev: vi.fn(),
    goToNext: vi.fn(),
  });
}

describe('WeeklyView', () => {
  test('shows loading state when week is null', () => {
    setup(null);
    render(<WeeklyView />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('shows empty goals placeholder when week is loaded', () => {
    setup({ id: 1, start_date: '2025-05-05' });
    render(<WeeklyView />);
    expect(screen.getByText(/no goals yet/i)).toBeInTheDocument();
  });

  test('renders WeekSelector with the current startDate', () => {
    setup({ id: 1, start_date: '2025-05-05' });
    render(<WeeklyView />);
    expect(screen.getByTestId('week-selector')).toHaveTextContent('2025-05-05');
  });

  test('renders MissionBanner', () => {
    setup({ id: 1, start_date: '2025-05-05' });
    render(<WeeklyView />);
    expect(screen.getByText('Mission Banner')).toBeInTheDocument();
  });
});
