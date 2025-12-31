const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

interface RequestOptions extends RequestInit {
  body?: any;
}

export const apiRequest = async (path: string, options: RequestOptions = {}) => {
  const url = `${BASE_URL}${path}`;
  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.message || 'API request failed');
  }

  return res.json();
};
