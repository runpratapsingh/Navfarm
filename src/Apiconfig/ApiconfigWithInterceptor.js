import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout} from '../utils/UtilsFn/Logout';

// Create Axios instance
const api = axios.create({
  baseURL: 'https://your-dotnet-api.com/api',
});

// Request Interceptor: Attach token before every request
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response Interceptor: Detect expired token (401) and log out the user
api.interceptors.response.use(
  response => response, // If response is successful, return it
  async error => {
    if (error.response && error.response.status === 401) {
      console.log('Token expired, logging out...');
      await logout(); // Call logout function when token expires
    }
    return Promise.reject(error);
  },
);

export default api;
