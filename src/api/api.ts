const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

interface RequestOptions extends RequestInit {
  body?: any;
}

interface Tokens {
  accessToken: string | null;
  idToken: string | null;
}

/**
 * Auth token getter registered by AuthContext/App
 * Keeps this file React-agnostic
 */
 let getTokens: (() => Tokens) | null = null;

 export const registerAuthTokenGetter = (fn: () => Tokens) => {
   getTokens = fn;
 };

export const apiRequest = async (path: string, options: RequestOptions = {}) => {
  const tokens = getTokens?.();
  const accessToken = tokens?.accessToken;
  const idToken = tokens?.idToken;

  const url = `${BASE_URL}${path}`;

  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(idToken ? { 'X-ID-Token': idToken } : {}), // <-- send ID token if available
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));

    // Optional future hook
    if (res.status === 401) {
      console.warn('Unauthorized request');
    }

    throw new Error(errBody.message || 'API request failed');
  }

  return res.json();
};
