import MissionBanner from './MissionBanner';
import WeekSelector from './WeekSelector';
import WeekRoleCard from './WeekRoleCard';
import AddRoleToWeek from './AddRoleToWeek';
import useWeeks from '../hooks/useWeeks';
import useWeeklyPlan from '../hooks/useWeeklyPlan';
import useRoles from '../hooks/useRoles';

export default function WeeklyView() {
  const { week, startDate, offset, goToPrev, goToNext } = useWeeks();
  const { roleGroups, addGoal, updateGoal, deleteGoal, addTask, updateTask, deleteTask } = useWeeklyPlan(week?.id);
  const { roles } = useRoles();

  const presentRoleIds = new Set(roleGroups.map(g => g.role_id));
  const availableRoles = roles.filter(r => !presentRoleIds.has(r.id));

  return (
    <div className="flex flex-col gap-6">
      <MissionBanner />
      <WeekSelector startDate={startDate} offset={offset} onPrev={goToPrev} onNext={goToNext} />

      {!week ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <>
          {roleGroups.length === 0 && roles.length === 0 && (
            <p className="text-sm text-gray-400">Create some roles first, then come back to plan your week.</p>
          )}
          {roleGroups.length === 0 && roles.length > 0 && (
            <p className="text-sm text-gray-400">No goals this week yet. Add a role below to get started.</p>
          )}

          {roleGroups.map(group => (
            <WeekRoleCard
              key={group.role_id}
              roleId={group.role_id}
              roleName={group.role_name}
              goals={group.goals}
              weekId={week.id}
              onGoalAdd={addGoal}
              onGoalUpdate={updateGoal}
              onGoalDelete={deleteGoal}
              onTaskAdd={addTask}
              onTaskDelete={deleteTask}
            />
          ))}

          {availableRoles.length > 0 && (
            <AddRoleToWeek roles={availableRoles} weekId={week.id} onGoalAdd={addGoal} />
          )}
        </>
      )}
    </div>
  );
}
