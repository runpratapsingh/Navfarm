import {clearDatabases} from '../../services/OfflineServices/Database';
import {navigationRef} from '../services/NavigationService';
import {clearAllData} from '../services/StorageHelper';

export const logout = async () => {
  clearDatabases();
  clearAllData();
  navigationRef.reset({index: 0, routes: [{name: 'login'}]});
};
