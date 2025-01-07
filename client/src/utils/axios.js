import axios from 'axios';
import toast from 'react-hot-toast';
import config from "./config";

console.log("Creating axios instance with baseURL:", config.apiUrl);

const instance = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log("Axios Request:", {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('Axios Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    console.log("Axios Response:", response);
    return response;
  },
    (error) => {
      console.error("Axios Response Error:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        config: {
          baseURL: error.config?.baseURL,
          url: error.config?.url,
          method: error.config?.method,
        },
      });

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.message || "An error occurred");
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server. Please try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("Error setting up request. Please try again.");
      }
      return Promise.reject(error);
    };
);

export default instance;
