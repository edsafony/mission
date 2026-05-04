import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MissionSection from './components/MissionSection';
import MissionBanner from './components/MissionBanner';
import RolesSection from './components/RolesSection';

export default function App() {
  const [activeSection, setActiveSection] = useState('mission');

  return (
    <div className="flex h-screen bg-white text-gray-900">
      <Sidebar activeSection={activeSection} onSelect={setActiveSection} />
      <main className="flex-1 overflow-y-auto p-8">
        {activeSection === 'mission' && <MissionSection />}
        {activeSection === 'roles' && <RolesSection />}
        {activeSection === 'weekly' && (
          <div className="flex flex-col gap-6">
            <MissionBanner />
            <p className="text-gray-400 text-sm">Weekly plan coming soon.</p>
          </div>
        )}
      </main>
    </div>
  );
}
