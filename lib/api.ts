const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

export async function postApi<T>(path: string, body: unknown): Promise<T> {
  if (!apiBaseUrl) throw new Error('Set EXPO_PUBLIC_API_BASE_URL in mobile/.env');
  const response = await fetch(`${apiBaseUrl}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data as T;
}