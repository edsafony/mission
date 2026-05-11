import { getMondayOf, toDateString, addWeeks, formatWeekLabel } from './dates';

describe('getMondayOf', () => {
  test('returns same day for a Monday', () => {
    const monday = new Date('2025-05-05T12:00:00');
    expect(toDateString(getMondayOf(monday))).toBe('2025-05-05');
  });

  test('returns the preceding Monday for a Wednesday', () => {
    const wed = new Date('2025-05-07T12:00:00');
    expect(toDateString(getMondayOf(wed))).toBe('2025-05-05');
  });

  test('returns the preceding Monday for a Sunday', () => {
    const sun = new Date('2025-05-11T12:00:00');
    expect(toDateString(getMondayOf(sun))).toBe('2025-05-05');
  });

  test('returns the preceding Monday for a Saturday', () => {
    const sat = new Date('2025-05-10T12:00:00');
    expect(toDateString(getMondayOf(sat))).toBe('2025-05-05');
  });
});

describe('toDateString', () => {
  test('formats date as YYYY-MM-DD', () => {
    expect(toDateString(new Date('2025-01-05T12:00:00'))).toBe('2025-01-05');
  });

  test('zero-pads month and day', () => {
    expect(toDateString(new Date('2025-01-01T12:00:00'))).toBe('2025-01-01');
  });
});

describe('addWeeks', () => {
  test('adds 1 week', () => {
    const d = new Date('2025-05-05T12:00:00');
    expect(toDateString(addWeeks(d, 1))).toBe('2025-05-12');
  });

  test('subtracts 1 week with negative n', () => {
    const d = new Date('2025-05-05T12:00:00');
    expect(toDateString(addWeeks(d, -1))).toBe('2025-04-28');
  });

  test('does not mutate the original date', () => {
    const d = new Date('2025-05-05T12:00:00');
    addWeeks(d, 3);
    expect(toDateString(d)).toBe('2025-05-05');
  });
});

describe('formatWeekLabel', () => {
  test('formats a week range Mon–Sun', () => {
    const monday = new Date('2025-05-05T12:00:00');
    expect(formatWeekLabel(monday)).toBe('May 5 – May 11, 2025');
  });

  test('includes the year of the Monday', () => {
    const monday = new Date('2025-12-29T12:00:00');
    expect(formatWeekLabel(monday)).toContain('2025');
  });
});
