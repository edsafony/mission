import { formatWeekLabel } from '../utils/dates';

export default function WeekSelector({ startDate, offset, onPrev, onNext }) {
  const monday = new Date(startDate + 'T00:00:00');
  const rangeLabel = formatWeekLabel(monday);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onPrev}
        className="px-2 py-1 text-gray-600 hover:text-gray-900 text-lg"
        aria-label="Previous week"
      >
        ←
      </button>
      <span className="text-sm font-medium text-gray-700">
        {offset === 0 && <span className="text-blue-600 mr-1">This Week ·</span>}
        {rangeLabel}
      </span>
      <button
        onClick={onNext}
        className="px-2 py-1 text-gray-600 hover:text-gray-900 text-lg"
        aria-label="Next week"
      >
        →
      </button>
    </div>
  );
}
