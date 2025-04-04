// storageHelper.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../JSON/storageKeys';

// Generic storage functions
const setItem = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
  }
};

export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log('All AsyncStorage data cleared successfully');
  } catch (error) {
    console.error('Error clearing all AsyncStorage data:', error);
  }
};

const getItem = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
};

const removeItem = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
  }
};

// Specific storage functions for your keys
export const appStorage = {
  // Common Details
  setCommonDetails: commonDetails =>
    setItem(STORAGE_KEYS.COMMON_DETAILS, commonDetails),
  getCommonDetails: () => getItem(STORAGE_KEYS.COMMON_DETAILS),
  removeCommonDetails: () => removeItem(STORAGE_KEYS.COMMON_DETAILS),

  // User Data
  setUserData: userData => setItem(STORAGE_KEYS.USER_DATA, userData),
  getUserData: () => getItem(STORAGE_KEYS.USER_DATA),
  removeUserData: () => removeItem(STORAGE_KEYS.USER_DATA),

  // Auth Token
  setAuthToken: token => setItem(STORAGE_KEYS.AUTH_TOKEN, token),
  getAuthToken: () => getItem(STORAGE_KEYS.AUTH_TOKEN),
  removeAuthToken: () => removeItem(STORAGE_KEYS.AUTH_TOKEN),

  // Selected Category
  setSelectedCategory: category =>
    setItem(STORAGE_KEYS.SELECTED_CATEGORY, category),
  getSelectedCategory: () => getItem(STORAGE_KEYS.SELECTED_CATEGORY),
  removeSelectedCategory: () => removeItem(STORAGE_KEYS.SELECTED_CATEGORY),
};
