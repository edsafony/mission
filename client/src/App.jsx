import { useState } from 'react';
import Sidebar from './components/Sidebar';
import RolesSection from './components/RolesSection';

export default function App() {
  const [activeSection, setActiveSection] = useState('roles');

  return (
    <div className="flex h-screen bg-white text-gray-900">
      <Sidebar activeSection={activeSection} onSelect={setActiveSection} />
      <main className="flex-1 overflow-y-auto p-8">
        {activeSection === 'roles' && <RolesSection />}
        {activeSection === 'weekly' && (
          <p className="text-gray-400 text-sm">Weekly plan coming soon.</p>
        )}
      </main>
    </div>
  );
}
