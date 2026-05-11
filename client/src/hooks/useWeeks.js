import { useState, useEffect } from 'react';
import { getOrCreateWeek } from '../api/weeks';
import { getMondayOf, addWeeks, toDateString } from '../utils/dates';

export default function useWeeks() {
  const [week, setWeek] = useState(null);
  const [offset, setOffset] = useState(0);

  const startDate = toDateString(addWeeks(getMondayOf(new Date()), offset));

  useEffect(() => {
    setWeek(null);
    getOrCreateWeek(startDate).then(setWeek).catch(console.error);
  }, [startDate]);

  return {
    week,
    startDate,
    offset,
    goToPrev: () => setOffset(o => o - 1),
    goToNext: () => setOffset(o => o + 1),
  };
}
