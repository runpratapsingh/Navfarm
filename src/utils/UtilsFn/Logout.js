import {navigationRef} from '../services/NavigationService';
import {clearAllData} from '../services/StorageHelper';

export const logout = async () => {
  clearAllData();
  navigationRef.reset({index: 0, routes: [{name: 'login'}]});
};
