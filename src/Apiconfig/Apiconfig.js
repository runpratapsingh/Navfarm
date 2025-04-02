const BASE_URL = `https://poultryapidev.navfarm.com/api`;

export const AUTH_HEADERS = {
    'Content-Type': 'application/json',
    'X-ApiKey': 'MyRandomApiKeyValue',
    'Authorization': `Basic ${btoa('xYvN7EOnhzdnTinyuq8amuhzRaBxNeOeeJyrp3/L0+Y=:f4eqUIMzUI4UyBwnFJOPhji8D2umvEC2GzJFDOmRzB8=')}`
};

export const API_ENDPOINTS = {
    LOGIN: `${BASE_URL}/signin`,
}
