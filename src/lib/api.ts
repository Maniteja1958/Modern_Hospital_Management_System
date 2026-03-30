const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const getApiUrl = (endpoint: string) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${BASE_URL}${cleanEndpoint}`;
};
