import { useState } from 'react';
import TaskItem from './TaskItem';

export default function GoalRow({ goal, onUpdate, onDelete, onTaskAdd, onTaskUpdate, onTaskDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');

  function startEdit() {
    setDraft(goal.text);
    setEditing(true);
  }

  async function handleSave() {
    if (!draft.trim()) return;
    await onUpdate(goal.id, draft.trim());
    setEditing(false);
  }

  async function handleAddTask(e) {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    await onTaskAdd(goal.id, newTaskText.trim());
    setNewTaskText('');
    setAddingTask(false);
  }

  const completedCount = goal.tasks.filter(t => t.completed).length;
  const totalCount = goal.tasks.length;

  return (
    <div className="ml-2 mb-3">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        {editing ? (
          <>
            <input
              className="flex-1 border border-blue-400 rounded px-2 py-0.5 text-sm"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              autoFocus
            />
            <button onClick={handleSave} className="text-xs text-green-700 hover:underline">Save</button>
            <button onClick={() => setEditing(false)} className="text-xs text-gray-500 hover:underline">Cancel</button>
          </>
        ) : (
          <>
            <span className="flex-1 text-sm font-medium text-gray-800">{goal.text}</span>
            {totalCount > 0 && (
              <span className="text-xs text-gray-400">{completedCount}/{totalCount}</span>
            )}
            <button onClick={startEdit} className="text-xs text-gray-400 hover:text-blue-600">Edit</button>
            <button onClick={() => onDelete(goal.id)} className="text-xs text-gray-400 hover:text-red-500" aria-label="Delete goal">Delete</button>
          </>
        )}
      </div>

      <ul className="ml-4 flex flex-col gap-0.5">
        {goal.tasks.map(task => (
          <TaskItem key={task.id} task={task} onUpdate={onTaskUpdate} onDelete={onTaskDelete} />
        ))}
      </ul>

      {addingTask ? (
        <form onSubmit={handleAddTask} className="flex flex-wrap gap-2 ml-4 mt-1">
          <input
            className="flex-1 border border-gray-300 rounded px-2 py-0.5 text-sm"
            placeholder="Task description"
            value={newTaskText}
            onChange={e => setNewTaskText(e.target.value)}
            autoFocus
          />
          <button type="submit" className="text-xs text-blue-700 hover:underline">Add</button>
          <button type="button" onClick={() => setAddingTask(false)} className="text-xs text-gray-500 hover:underline">Cancel</button>
        </form>
      ) : (
        <button
          onClick={() => setAddingTask(true)}
          className="ml-4 mt-1 text-xs text-gray-400 hover:text-blue-600"
        >
          + Add task
        </button>
      )}
    </div>
  );
}
