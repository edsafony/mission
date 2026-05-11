import { useState, useEffect, useMemo } from 'react';
import { getWeek } from '../api/weeks';
import { createGoal, updateGoal as apiUpdateGoal, deleteGoal as apiDeleteGoal } from '../api/goals';
import { createTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from '../api/tasks';

export default function useWeeklyPlan(weekId) {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (!weekId) { setGoals([]); return; }
    getWeek(weekId).then(data => setGoals(data.goals ?? [])).catch(console.error);
  }, [weekId]);

  const roleGroups = useMemo(() => {
    const map = new Map();
    for (const goal of goals) {
      if (!map.has(goal.role_id)) {
        map.set(goal.role_id, { role_id: goal.role_id, role_name: goal.role_name, goals: [] });
      }
      map.get(goal.role_id).goals.push(goal);
    }
    return [...map.values()];
  }, [goals]);

  async function addGoal(weekId, roleId, text) {
    const goal = await createGoal(weekId, roleId, text);
    setGoals(prev => [...prev, { ...goal, tasks: [] }]);
    return goal;
  }

  async function updateGoal(id, text) {
    const goal = await apiUpdateGoal(id, { text });
    setGoals(prev => prev.map(g => g.id === id ? { ...g, text: goal.text } : g));
  }

  async function deleteGoal(id) {
    await apiDeleteGoal(id);
    setGoals(prev => prev.filter(g => g.id !== id));
  }

  async function addTask(goalId, text) {
    const task = await createTask(goalId, text);
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, tasks: [...g.tasks, task] } : g));
    return task;
  }

  async function updateTask(id, fields) {
    const task = await apiUpdateTask(id, fields);
    setGoals(prev => prev.map(g => ({
      ...g,
      tasks: g.tasks.map(t => t.id === id ? task : t),
    })));
  }

  async function deleteTask(id) {
    await apiDeleteTask(id);
    setGoals(prev => prev.map(g => ({
      ...g,
      tasks: g.tasks.filter(t => t.id !== id),
    })));
  }

  return { roleGroups, addGoal, updateGoal, deleteGoal, addTask, updateTask, deleteTask };
}
