import axios from 'axios';

// Base URL for Render backend
const BASE_URL = 'https://qrcode-attendance-system-7ucl.onrender.com';

// Create global Axios instance configured for HTTPS requests and responses
const Api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 70000, // 70 seconds timeout
});

// Response Interceptor (Global Error Handling)
Api.interceptors.response.use(
  (response) => {
    // Return direct response data to simplify your API calls
    return response.data;
  },
  (error) => {
    // Global handling for standard HTTP error statuses
    if (error.response) {
      console.error(`API Error [${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      console.error('Network Error: No response received from server.');
    } else {
      console.error('API Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default Api;