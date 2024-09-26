const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
};

export async function apiFetch<T>(
  route: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;

  const response = await fetch(route, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    // Optionally handle specific HTTP errors here
    const errorData = await response.json();
    // TODO handle modal errors here
    throw new Error(errorData.message || 'API request failed');
  }

  // Parse and return the response data as JSON
  return response.json();
}
