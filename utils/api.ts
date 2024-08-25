const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export interface ResponseWithHeadersInterface {
  headers: Headers;
  data: unknown[];
}

export async function api(
  route: string,
  options: RequestInit = {}
): Promise<unknown> {
  try {
    const response = await fetch(`${BASE_URL}${route}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });

    console.log('route', `${BASE_URL}${route}`);
    console.log('response headers', response.headers);
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    }
  } catch (error) {
    console.error(`Error fetching from ${BASE_URL}${route}:`, error);

    // handle error for ErrorDialog here
    // return {
    //   success: false,
    //   error: error instanceof Error ? error.message : `Error fetching ${route}`,
    //   status: 400,
    // };
  }
}
