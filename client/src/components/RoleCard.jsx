import { useState } from 'react';

export default function RoleCard({ role, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(role.description ?? '');

  function handleEdit() {
    setName(role.name);
    setDescription(role.description ?? '');
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
  }

  function handleSave() {
    onUpdate(role.id, { name, description: description || null });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
        <input
          className="border border-gray-300 rounded px-2 py-1 text-sm"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-500"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description (optional)"
        />
        <div className="flex gap-2">
          <button
            className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
      <div>
        <p className="font-medium text-gray-900">{role.name}</p>
        {role.description && (
          <p className="text-sm text-gray-500 mt-0.5">{role.description}</p>
        )}
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
          onClick={handleEdit}
        >
          Edit
        </button>
        <button
          className="text-sm px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
          onClick={() => onDelete(role.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
