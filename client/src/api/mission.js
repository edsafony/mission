export async function getMission() {
  const res = await fetch('/api/mission');
  if (!res.ok) throw new Error('Failed to fetch mission');
  return res.json();
}

export async function updateMission(text) {
  const res = await fetch('/api/mission', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to update mission');
  return res.json();
}
