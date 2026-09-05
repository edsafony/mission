import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MissionSection from './components/MissionSection';
import RolesSection from './components/RolesSection';
import WeeklyView from './components/WeeklyView';
import { getMission } from './api/mission';
import { getRoles } from './api/roles';

export default function App() {
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getMission(), getRoles()])
      .then(([mission, roles]) => {
        if (cancelled) return;
        const alreadySetUp = Boolean(mission.text?.trim()) && roles.length > 0;
        setActiveSection(alreadySetUp ? 'weekly' : 'mission');
      })
      .catch(() => {
        if (!cancelled) setActiveSection('mission');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!activeSection) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-gray-900">
      <Sidebar activeSection={activeSection} onSelect={setActiveSection} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        {activeSection === 'mission' && <MissionSection />}
        {activeSection === 'roles' && <RolesSection />}
        {activeSection === 'weekly' && <WeeklyView />}
      </main>
    </div>
  );
}
