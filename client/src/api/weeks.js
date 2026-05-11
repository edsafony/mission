export async function getWeeks() {
  const res = await fetch('/api/weeks');
  if (!res.ok) throw new Error('Failed to fetch weeks');
  return res.json();
}

export async function getOrCreateWeek(startDate) {
  const res = await fetch('/api/weeks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ start_date: startDate }),
  });
  if (res.status === 201 || res.status === 409) return res.json();
  throw new Error('Failed to get or create week');
}

export async function getWeek(id) {
  const res = await fetch(`/api/weeks/${id}`);
  if (!res.ok) throw new Error('Failed to fetch week');
  return res.json();
}
