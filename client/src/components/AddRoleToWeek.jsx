import { useState } from 'react';

export default function AddRoleToWeek({ roles, weekId, onGoalAdd }) {
  const [open, setOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [goalText, setGoalText] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedRoleId || !goalText.trim()) return;
    await onGoalAdd(weekId, Number(selectedRoleId), goalText.trim());
    setOpen(false);
    setSelectedRoleId('');
    setGoalText('');
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="self-start px-4 py-2 border border-dashed border-gray-300 text-sm text-gray-500 rounded-lg hover:border-blue-400 hover:text-blue-600"
      >
        + Add Role to This Week
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-700">Add a role to this week</p>
      <select
        className="border border-gray-300 rounded px-3 py-1.5 text-sm"
        value={selectedRoleId}
        onChange={e => setSelectedRoleId(e.target.value)}
      >
        <option value="">Select a role…</option>
        {roles.map(r => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>
      <input
        className="border border-gray-300 rounded px-3 py-1.5 text-sm"
        placeholder="First goal for this role"
        value={goalText}
        onChange={e => setGoalText(e.target.value)}
      />
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Add</button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm rounded hover:bg-gray-200">Cancel</button>
      </div>
    </form>
  );
}
