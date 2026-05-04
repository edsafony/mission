import { useState } from 'react';
import useRoles from '../hooks/useRoles';
import RoleCard from './RoleCard';

export default function RolesSection() {
  const { roles, add, update, remove } = useRoles();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await add(name.trim(), description.trim());
    setName('');
    setDescription('');
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-800">Roles</h2>

      {roles.length === 0 ? (
        <p className="text-sm text-gray-400">No roles yet. Add one below.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {roles.map(role => (
            <RoleCard
              key={role.id}
              role={role}
              onUpdate={update}
              onDelete={remove}
            />
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="flex gap-2 mt-2">
        <input
          className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm"
          placeholder="Role name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm"
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Add
        </button>
      </form>
    </div>
  );
}
