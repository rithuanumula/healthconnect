let API_URL = import.meta.env.VITE_API_URL || '/api';

// Ensure absolute API URLs have the /api suffix (helpful for Render/live deployment)
if (API_URL.startsWith('http://') || API_URL.startsWith('https://')) {
  if (!API_URL.endsWith('/api') && !API_URL.endsWith('/api/')) {
    API_URL = `${API_URL.replace(/\/$/, '')}/api`;
  }
}

/**
 * Custom fetcher wrapper that mimics Axios functionality
 * built on native fetch to prevent version conflicts or bundling issues.
 */
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Set headers
    const headers = {
      ...options.headers
    };

    // Auto append content-type unless we are uploading files (FormData handles it automatically)
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Attach JWT token if stored
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      
      // Safely parse JSON or extract text depending on the Content-Type header
      const contentType = response.headers.get('content-type');
      let data = null;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Expected JSON response, but received HTML/Text. Status: ${response.status}. Preview: ${text.slice(0, 150)}`);
      }

      if (!response.ok) {
        throw {
          response: {
            data: data || { message: 'Something went wrong' },
            status: response.status
          },
          message: data.message || 'Something went wrong'
        };
      }

      return { data, status: response.status };
    } catch (error) {
      if (error.response) {
        throw error;
      }
      throw {
        response: {
          data: { message: error.message || 'Network Error' },
          status: 500
        },
        message: error.message || 'Network Error'
      };
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

const api = new ApiClient(API_URL);

export { API_URL };
export default api;
