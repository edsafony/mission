export default function Sidebar({ activeSection, onSelect }) {
  const items = [
    { id: 'mission', label: 'Mission' },
    { id: 'roles', label: 'Roles' },
    { id: 'weekly', label: 'Weekly Plan' },
  ];

  return (
    <aside className="w-56 shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="px-4 py-5 border-b border-gray-200">
        <h1 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Mission Tracker</h1>
      </div>
      <nav className="flex flex-col gap-1 p-2">
        {items.map(item => (
          <button
            key={item.id}
            className={`text-left px-3 py-2 rounded text-sm ${
              activeSection === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => onSelect(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
