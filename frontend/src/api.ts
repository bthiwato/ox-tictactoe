export async function getMe() {
  const res = await fetch('/api/me', { credentials: 'include' });
  if (!res.ok) return null;
  return res.json();
}

export async function startNew(starter: 'X'|'O', difficulty: 'easy'|'hard') {
  const res = await fetch('/api/game/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ starter, difficulty })
  });
  return res.json();
}

export async function move(board: string[], index: number, difficulty: 'easy'|'hard') {
  const res = await fetch('/api/game/move', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ board, index, difficulty })
  });
  return res.json();
}

export async function finish(board: string[], winner: 'X'|'O'|'DRAW') {
  const res = await fetch('/api/game/finish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ board, winner })
  });
  return res.json();
}

export function loginGoogle() {
  window.location.href = '/auth/google';
}

export async function logout() {
  await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
  window.location.reload();
}

export async function getLeaderboard() {
  const res = await fetch('/api/leaderboard', { credentials: 'include' });
  return res.json();
}