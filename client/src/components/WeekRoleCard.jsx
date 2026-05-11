import { useState } from 'react';
import GoalRow from './GoalRow';

export default function WeekRoleCard({ roleId, roleName, goals, weekId, onGoalAdd, onGoalUpdate, onGoalDelete, onTaskAdd, onTaskUpdate, onTaskDelete }) {
  const [addingGoal, setAddingGoal] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');

  async function handleAddGoal(e) {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    await onGoalAdd(weekId, roleId, newGoalText.trim());
    setNewGoalText('');
    setAddingGoal(false);
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
      <h3 className="text-base font-semibold text-gray-800">{roleName}</h3>

      {goals.map(goal => (
        <GoalRow
          key={goal.id}
          goal={goal}
          onUpdate={onGoalUpdate}
          onDelete={onGoalDelete}
          onTaskAdd={onTaskAdd}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
        />
      ))}

      {addingGoal ? (
        <form onSubmit={handleAddGoal} className="flex gap-2 mt-1">
          <input
            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            placeholder="Goal description"
            value={newGoalText}
            onChange={e => setNewGoalText(e.target.value)}
            autoFocus
          />
          <button type="submit" className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Add</button>
          <button type="button" onClick={() => setAddingGoal(false)} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200">Cancel</button>
        </form>
      ) : (
        <button
          onClick={() => setAddingGoal(true)}
          className="self-start text-xs text-gray-400 hover:text-blue-600 mt-1"
        >
          + Add goal
        </button>
      )}
    </div>
  );
}
