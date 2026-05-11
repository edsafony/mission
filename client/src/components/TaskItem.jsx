export default function TaskItem({ task, onDelete }) {
  return (
    <li className="flex items-center gap-2 py-0.5">
      <span className="flex-1 text-sm text-gray-700">{task.text}</span>
      <button
        onClick={() => onDelete(task.id)}
        className="text-gray-400 hover:text-red-500 text-xs px-1"
        aria-label="Delete task"
      >
        ×
      </button>
    </li>
  );
}
