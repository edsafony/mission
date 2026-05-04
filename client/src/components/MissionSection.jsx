import { useState } from 'react';
import useMission from '../hooks/useMission';

export default function MissionSection() {
  const { text, save } = useMission();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  function startEdit() {
    setDraft(text);
    setEditing(true);
  }

  function cancel() {
    setEditing(false);
  }

  async function handleSave() {
    await save(draft);
    setEditing(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-gray-800">My Mission Statement</h2>

      {editing ? (
        <>
          <textarea
            className="w-full border border-blue-400 rounded px-3 py-2 text-sm bg-gray-50 resize-none"
            rows={5}
            value={draft}
            onChange={e => setDraft(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={cancel}
              className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          {text ? (
            <p className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded px-3 py-2 italic">
              {text}
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              What is your personal mission? Click Edit to write it.
            </p>
          )}
          <button
            onClick={startEdit}
            className="self-end px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
}
