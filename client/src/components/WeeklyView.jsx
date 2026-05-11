import MissionBanner from './MissionBanner';
import WeekSelector from './WeekSelector';
import useWeeks from '../hooks/useWeeks';

export default function WeeklyView() {
  const { week, startDate, offset, goToPrev, goToNext } = useWeeks();

  return (
    <div className="flex flex-col gap-6">
      <MissionBanner />
      <WeekSelector
        startDate={startDate}
        offset={offset}
        onPrev={goToPrev}
        onNext={goToNext}
      />
      {week ? (
        <p className="text-sm text-gray-400">No goals yet.</p>
      ) : (
        <p className="text-sm text-gray-400">Loading…</p>
      )}
    </div>
  );
}
