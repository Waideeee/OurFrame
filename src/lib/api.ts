const BASE_URL = import.meta.env.VITE_API_URL;
export const TOKEN_KEY = 'ourframe_token'; 

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
 const token = localStorage.getItem(TOKEN_KEY);
 
  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if(!response.ok){
     const errorBody = await response.json().catch(()=>({}))
     throw new Error(errorBody.error || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
    }

    return (await response.json()) as T;
}