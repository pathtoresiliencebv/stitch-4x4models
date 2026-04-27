export const API_CONFIG = {
  baseUrl: 'https://stimulating-growth-suite-ai.base44.app/api',
  appId: '699871557dfcaafa02868052',
  apiKey: '4d740112ee914feea4c1d567d68ce926',
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
      'x-app-id': API_CONFIG.appId,
      'x-api-key': API_CONFIG.apiKey,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API Error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}
