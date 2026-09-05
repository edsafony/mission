import { useState } from 'react';

function ChevronDoubleIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5M4.5 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

function FlagIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 3v18" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 4.5c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0v9c-1.5 1-3 1-4.5 0s-3-1-4.5 0-3 1-4.5 0v-9z"
      />
    </svg>
  );
}

function UsersIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.5a3 3 0 00-3-3H6a3 3 0 00-3 3M9 12.75a3 3 0 100-6 3 3 0 000 6zM21 19.5a3 3 0 00-2.25-2.9M16.5 6.16a3 3 0 010 5.68"
      />
    </svg>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <rect x="3.75" y="5.25" width="16.5" height="15" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5M8.25 3v3M15.75 3v3" />
    </svg>
  );
}

const items = [
  { id: 'mission', label: 'Mission', icon: FlagIcon },
  { id: 'roles', label: 'Roles', icon: UsersIcon },
  { id: 'weekly', label: 'Weekly Plan', icon: CalendarIcon },
];

export default function Sidebar({ activeSection, onSelect }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside
      className={`${
        collapsed ? 'w-14' : 'w-56'
      } shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col transition-[width] duration-150`}
    >
      <div className="flex items-center justify-between gap-2 px-2 py-4 border-b border-gray-200">
        {!collapsed && (
          <h1 className="text-sm font-semibold text-gray-800 uppercase tracking-wide truncate pl-1">
            Mission Tracker
          </h1>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="p-2 rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700 shrink-0"
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          <ChevronDoubleIcon className={`w-4 h-4 ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>
      <nav className="flex flex-col gap-1 p-2">
        {items.map(item => (
          <button
            key={item.id}
            title={collapsed ? item.label : undefined}
            aria-label={item.label}
            className={`flex items-center gap-3 text-left px-3 py-2 rounded text-sm ${
              collapsed ? 'justify-center' : ''
            } ${activeSection === item.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={() => onSelect(item.id)}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}
