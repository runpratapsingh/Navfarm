import axios from 'axios';
import {logout} from '../utils/UtilsFn/Logout';
import {Alert} from 'react-native';
import {appStorage} from '../utils/services/StorageHelper';

const api = axios.create({
  baseURL: 'https://poultryapidev.navfarm.com/api',
  headers: {
    'Content-Type': 'application/json',
    'X-ApiKey': 'MyRandomApiKeyValue',
  },
  timeout: 10000,
});

const BASIC_AUTH_USERNAME = 'xYvN7EOnhzdnTinyuq8amuhzRaBxNeOeeJyrp3/L0+Y=';
const BASIC_AUTH_PASSWORD = 'f4eqUIMzUI4UyBwnFJOPhji8D2umvEC2GzJFDOmRzB8=';

const basicAuth = `Basic ${btoa(
  `${BASIC_AUTH_USERNAME}:${BASIC_AUTH_PASSWORD}`,
)}`;

api.interceptors.request.use(
  async config => {
    const token = await appStorage.getAuthToken();
    config.headers['Authorization'] = basicAuth;

    if (token) {
      config.headers['authToken'] = `${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  response => response,
  async error => {
    console.log('Response error:==================', error);
    const errorDetails = {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
    console.error('API Response Error:', errorDetails);
    if (
      (error?.response && error?.response?.status === 401) ||
      error?.response?.status === 403
    ) {
      console.log('Token expired, logging out...');
      Alert.alert(
        'Session Expired',
        'Your token has expired. Please log in again.',
        [
          {
            text: 'OK',
            onPress: async () => {
              await logout();
            },
          },
        ],
        {cancelable: false},
      );
    }
    return Promise.reject(error);
  },
);

export default api;
