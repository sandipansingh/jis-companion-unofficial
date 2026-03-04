import axios from 'axios';
import { Platform } from 'react-native';

/**
 * Standard API response envelope returned by the official API.
 * @template T - Payload type stored in `data.data`.
 */
export interface StandardApiResponse<T = string> {
  data: {
    data: T;
    errorCode: number;
    totalRecords: number;
    totalPage: number;
    message: string;
  };
  errorCode: number;
  totalRecords: number;
  totalPage: number;
  message: string;
}

const isWeb = Platform.OS === 'web';
const isProd = process.env.EXPO_PUBLIC_ENV === 'production';

export const API_URL =
  isProd && isWeb
    ? process.env.EXPO_PUBLIC_API_PROXY_URL
    : process.env.EXPO_PUBLIC_API_URL;

const UNOFFICIAL_API_URL = process.env.EXPO_PUBLIC_UNOFFICIAL_API_URL;

// Validate environment variables
if (!API_URL) {
  throw new Error(
    'EXPO_PUBLIC_API_URL or EXPO_PUBLIC_API_PROXY_URL is not defined. Please create a .env file based on .env.example and set the required environment variables.',
  );
}

if (!UNOFFICIAL_API_URL) {
  throw new Error(
    'EXPO_PUBLIC_UNOFFICIAL_API_URL is not defined. Please create a .env file based on .env.example and set the required environment variables.',
  );
}

// Create official API client
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create unofficial API client
const unofficialApiClient = axios.create({
  baseURL: UNOFFICIAL_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Official API interceptors
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response
      console.error('Network Error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  },
);

// Unofficial API interceptors
unofficialApiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

unofficialApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Unofficial API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
export { unofficialApiClient };
