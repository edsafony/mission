export function getMondayOf(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addWeeks(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n * 7);
  return d;
}

export function formatWeekLabel(mondayDate) {
  const sunday = new Date(mondayDate);
  sunday.setDate(sunday.getDate() + 6);
  const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
  return `${fmt.format(mondayDate)} – ${fmt.format(sunday)}, ${mondayDate.getFullYear()}`;
}
