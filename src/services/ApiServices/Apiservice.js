import {API_ENDPOINTS} from '../../Apiconfig/Apiconfig';
import api from '../../Apiconfig/ApiconfigWithInterceptor';
import {checkNetworkStatus} from '../NetworkServices/Network';
import {
  cacheApiResponse,
  getCachedResponse,
  saveOfflineDataEntry,
  getUnsyncedDataEntries,
  markAsSynced,
} from '../OfflineServices/Database';

export const fetchData = async (endpoint, params = {}) => {
  return new Promise((resolve, reject) => {
    checkNetworkStatus(async isConnected => {
      if (isConnected) {
        try {
          const response = await api.get(endpoint, {params});
          await new Promise(res =>
            cacheApiResponse(endpoint, response.data, res),
          );
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      } else {
        console.log('You are offline==============');

        getCachedResponse(endpoint, data => {
          if (data) {
            resolve(data);
          } else {
            reject(
              new Error('No cached data available2222222222222222222--------'),
            );
          }
        });
      }
    });
  });
};

export const fetchDataEntryDetails = async (
  endpoint,
  params = {},
  batch_id = '',
) => {
  return new Promise((resolve, reject) => {
    checkNetworkStatus(async isConnected => {
      if (isConnected) {
        try {
          const response = await api.get(endpoint, {params});
          console.log('aklshdjahfajsfhlas', endpoint, {params});

          await new Promise(res =>
            cacheApiResponse(endpoint, batch_id, response.data, res),
          );
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      } else {
        getCachedResponse(endpoint, batch_id, data => {
          if (data) {
            resolve(data);
          } else {
            reject(new Error('No cached data available0000-------------'));
          }
        });
      }
    });
  });
};

export const postDataEntry = async data => {
  return new Promise((resolve, reject) => {
    checkNetworkStatus(async isConnected => {
      if (isConnected) {
        try {
          const response = await api.post(
            API_ENDPOINTS.SaveAndPostDataEntry,
            data,
          );
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      } else {
        // Save data entry for later syncing
        saveOfflineDataEntry(data, API_ENDPOINTS.SaveAndPostDataEntry, () => {
          resolve({status: 'queued', message: 'Data saved for syncing'});
        });
      }
    });
  });
};

export const syncOfflineData = async () => {
  checkNetworkStatus(async isConnected => {
    if (!isConnected) return;

    const unsyncedEntries = await new Promise(resolve =>
      getUnsyncedDataEntries(resolve),
    );

    for (const entry of unsyncedEntries) {
      try {
        const data = JSON.parse(entry.data);
        const response = await api.post(entry.endpoint, data);
        markAsSynced(entry.id);
      } catch (error) {
        console.error('Sync error for entry', entry.id, error);
      }
    }
  });
};
