const API_BASE = '/api';

export const getAuthToken = () => {
  return localStorage.getItem('dos_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('dos_token', token);
  } else {
    localStorage.removeItem('dos_token');
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      // Clear token and trigger logout if expired
      setAuthToken(null);
      localStorage.removeItem('dos_user');
      window.dispatchEvent(new Event('auth_logout'));
    }
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, body) => apiRequest(endpoint, { method: 'DELETE', body: body ? JSON.stringify(body) : undefined }),
};
