import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('../hooks/useWeeks', () => ({ default: vi.fn() }));
vi.mock('../hooks/useWeeklyPlan', () => ({ default: vi.fn() }));
vi.mock('../hooks/useRoles', () => ({ default: vi.fn() }));
vi.mock('./MissionBanner', () => ({ default: () => <div>Mission Banner</div> }));
vi.mock('./WeekSelector', () => ({ default: ({ startDate }) => <div data-testid="week-selector">{startDate}</div> }));
vi.mock('./WeekRoleCard', () => ({ default: ({ roleName }) => <div data-testid="week-role-card">{roleName}</div> }));
vi.mock('./AddRoleToWeek', () => ({ default: () => <div data-testid="add-role-to-week" /> }));

import WeeklyView from './WeeklyView';
import useWeeks from '../hooks/useWeeks';
import useWeeklyPlan from '../hooks/useWeeklyPlan';
import useRoles from '../hooks/useRoles';

function setupHooks({ week = { id: 1, start_date: '2025-05-05' }, roleGroups = [], roles = [] } = {}) {
  useWeeks.mockReturnValue({ week, startDate: '2025-05-05', offset: 0, goToPrev: vi.fn(), goToNext: vi.fn() });
  useWeeklyPlan.mockReturnValue({ roleGroups, addGoal: vi.fn(), updateGoal: vi.fn(), deleteGoal: vi.fn(), addTask: vi.fn(), updateTask: vi.fn(), deleteTask: vi.fn() });
  useRoles.mockReturnValue({ roles });
}

describe('WeeklyView', () => {
  test('shows loading when week is null', () => {
    setupHooks({ week: null });
    render(<WeeklyView />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('shows "create roles" message when week loaded but no roles exist', () => {
    setupHooks({ roleGroups: [], roles: [] });
    render(<WeeklyView />);
    expect(screen.getByText(/create some roles/i)).toBeInTheDocument();
  });

  test('shows "no goals" hint when roles exist but none added this week', () => {
    setupHooks({ roleGroups: [], roles: [{ id: 1, name: 'Father' }] });
    render(<WeeklyView />);
    expect(screen.getByText(/no goals this week/i)).toBeInTheDocument();
  });

  test('renders a WeekRoleCard for each role group', () => {
    setupHooks({
      roleGroups: [
        { role_id: 1, role_name: 'Father', goals: [] },
        { role_id: 2, role_name: 'Professional', goals: [] },
      ],
      roles: [{ id: 1, name: 'Father' }, { id: 2, name: 'Professional' }],
    });
    render(<WeeklyView />);
    expect(screen.getAllByTestId('week-role-card')).toHaveLength(2);
  });

  test('renders AddRoleToWeek when there are roles not yet in this week', () => {
    setupHooks({
      roleGroups: [],
      roles: [{ id: 1, name: 'Father' }],
    });
    render(<WeeklyView />);
    expect(screen.getByTestId('add-role-to-week')).toBeInTheDocument();
  });

  test('does not render AddRoleToWeek when all roles are already in the week', () => {
    setupHooks({
      roleGroups: [{ role_id: 1, role_name: 'Father', goals: [] }],
      roles: [{ id: 1, name: 'Father' }],
    });
    render(<WeeklyView />);
    expect(screen.queryByTestId('add-role-to-week')).not.toBeInTheDocument();
  });
});
