export async function createGoal(weekId, roleId, text) {
  const res = await fetch('/api/goals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ week_id: weekId, role_id: roleId, text }),
  });
  if (!res.ok) throw new Error('Failed to create goal');
  return res.json();
}

export async function updateGoal(id, fields) {
  const res = await fetch(`/api/goals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
  if (!res.ok) throw new Error('Failed to update goal');
  return res.json();
}

export async function deleteGoal(id) {
  const res = await fetch(`/api/goals/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete goal');
  return res.json();
}
