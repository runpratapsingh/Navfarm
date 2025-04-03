import {navigationRef} from '../services/NavigationService';
import {appStorage} from '../services/StorageHelper';

export const logout = async () => {
  await appStorage.removeAuthToken();
  await appStorage.removeUserData();
  navigationRef.reset({index: 0, routes: [{name: 'login'}]});
};
