export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BASE44_API_URL || 'https://stimulating-growth-suite-ai.base44.app/api',
  appId: process.env.NEXT_PUBLIC_BASE44_APP_ID || '699871557dfcaafa02868052',
  apiKey: process.env.BASE44_API_KEY || '',
} as const;

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'api_key': API_CONFIG.apiKey,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API Error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}
