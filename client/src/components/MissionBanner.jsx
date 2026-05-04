import useMission from '../hooks/useMission';

export default function MissionBanner() {
  const { text } = useMission();
  if (!text) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded px-4 py-3">
      <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Your Mission</p>
      <p className="text-sm text-amber-900 italic">{text}</p>
    </div>
  );
}
