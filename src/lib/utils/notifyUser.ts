export async function notifyUser(
  userId: string,
  payload: { title: string; body: string; url?: string },
) {
  try {
    await fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...payload }),
    })
  } catch {
    // Push delivery is best-effort and must never block the primary action.
  }
}
