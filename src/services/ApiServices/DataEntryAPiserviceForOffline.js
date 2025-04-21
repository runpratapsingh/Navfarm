import {API_ENDPOINTS} from '../../Apiconfig/Apiconfig';
import api from '../../Apiconfig/ApiconfigWithInterceptor';
import {checkNetworkStatus} from '../NetworkServices/Network';
import {
  cacheApiResponseForDataEntry,
  getCachedResponseForDataEntry,
  getUnsyncedDataEntriesForDataEntry,
  markAsSyncedForDataEntry,
  saveOfflineDataEntryForDataEntry,
} from '../OfflineServices/DataentryOfflineDB';

export const fetchData = async (endpoint, params = {}) => {
  return new Promise((resolve, reject) => {
    checkNetworkStatus(isConnected => {
      if (isConnected) {
        api
          .get(endpoint, {params})
          .then(response => {
            cacheApiResponseForDataEntry(endpoint, '', response.data, () => {
              resolve(response.data);
            });
          })
          .catch(error => reject(error));
      } else {
        console.log('You are offline==============');
        getCachedResponseForDataEntry(endpoint, '', data => {
          if (data) {
            resolve(data);
          } else {
            reject(
              new Error('No cached data available-0000000000000000000000---'),
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
    checkNetworkStatus(isConnected => {
      if (isConnected) {
        api
          .get(endpoint, {params})
          .then(response => {
            cacheApiResponseForDataEntry(
              endpoint,
              batch_id,
              response.data,
              () => {
                resolve(response.data);
              },
            );
          })
          .catch(error => reject(error));
      } else {
        getCachedResponse(endpoint, batch_id, data => {
          if (data) {
            resolve(data);
          } else {
            reject(new Error('No cached data available11111111111111---'));
          }
        });
      }
    });
  });
};

export const postDataEntry = async (data, batch_id = '') => {
  return new Promise((resolve, reject) => {
    checkNetworkStatus(isConnected => {
      if (isConnected) {
        api
          .post(API_ENDPOINTS.SaveAndPostDataEntry, data)
          .then(response => resolve(response.data))
          .catch(error => reject(error));
      } else {
        saveOfflineDataEntryForDataEntry(
          data,
          API_ENDPOINTS.SaveAndPostDataEntry,
          batch_id,
          () => {
            resolve({status: 'queued', message: 'Data saved for syncing'});
          },
        );
      }
    });
  });
};

export const syncOfflineData = async () => {
  return new Promise(resolve => {
    checkNetworkStatus(isConnected => {
      if (!isConnected) {
        resolve();
        return;
      }

      getUnsyncedDataEntriesForDataEntry(unsyncedEntries => {
        if (!unsyncedEntries.length) {
          resolve();
          return;
        }

        const syncPromises = unsyncedEntries.map(entry =>
          api
            .post(entry.endpoint, JSON.parse(entry.data))
            .then(() => markAsSyncedForDataEntry(entry.id))
            .catch(error =>
              console.error('Sync error for entry', entry.id, error),
            ),
        );

        Promise.all(syncPromises).then(() => resolve());
      });
    });
  });
};
