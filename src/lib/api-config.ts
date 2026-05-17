export const API_CONFIG = {
  baseUrl: 'https://stimulating-growth-suite-ai.base44.app/api',
  appId: '6a09fd6a73c15fa19aeb41f8',
  apiKey: 'f497a9fa558244729d43461df1f9b91b',
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
