import SQLite from 'react-native-sqlite-storage';

// Enable promise-based API
SQLite.enablePromise(true);

let db = null;
let isDbInitialized = false;

// Open database with retries
const openDatabase = async (retries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(
        `Attempting to open NavFarmDataEntry.db (Attempt ${attempt}/${retries})...`,
      );
      db = await SQLite.openDatabase({
        name: 'NavFarmDataEntry.db',
        location: 'default',
      });
      console.log('NavFarmDataEntry.db opened successfully.');
      return db;
    } catch (error) {
      console.error(
        `Error opening NavFarmDataEntry.db (Attempt ${attempt}/${retries}):`,
        error,
      );
      if (attempt === retries) {
        throw new Error(
          'Failed to open NavFarmDataEntry.db after multiple attempts',
        );
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Initialize database tables
export const initDatabaseForDataEntry = async () => {
  try {
    if (!db || typeof db.transaction !== 'function') {
      await openDatabase();
    }
    if (!db || typeof db.transaction !== 'function') {
      throw new Error('Database object is invalid after opening');
    }

    await new Promise((resolve, reject) => {
      db.transaction(
        tx => {
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS ApiCache (
              endpoint TEXT,
              batch_id TEXT,
              data TEXT,
              lastUpdated TEXT,
              PRIMARY KEY (endpoint, batch_id)
            )`,
            [],
            () => console.log('ApiCache table created or exists.'),
            (_, error) => {
              console.error('Error creating ApiCache table:', error);
              reject(
                error || new Error('Unknown error creating ApiCache table'),
              );
            },
          );
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS OfflineDataEntries (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              data TEXT,
              endpoint TEXT,
              batch_id TEXT,
              synced INTEGER,
              createdAt TEXT
            )`,
            [],
            () => {
              console.log('OfflineDataEntries table created or exists.');
              resolve();
            },
            (_, error) => {
              console.error('Error creating OfflineDataEntries table:', error);
              reject(
                error ||
                  new Error('Unknown error creating OfflineDataEntries table'),
              );
            },
          );
        },
        error => {
          console.error('Transaction error during initialization:', error);
          reject(error || new Error('Unknown transaction error'));
        },
      );
    });

    isDbInitialized = true;
    console.log('NavFarmDataEntry.db initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize NavFarmDataEntry.db:', error.message);
    isDbInitialized = false;
    db = null; // Reset db to force re-initialization
    throw error;
  }
};

// Ensure database is initialized
const ensureDbInitialized = async () => {
  if (!isDbInitialized || !db || typeof db.transaction !== 'function') {
    console.log(
      'NavFarmDataEntry.db not initialized or invalid, initializing...',
    );
    await initDatabaseForDataEntry();
  }
};

// Cache API response
export const cacheApiResponseForDataEntry = async (
  endpoint,
  batch_id,
  data,
  callback,
) => {
  try {
    await ensureDbInitialized();

    // Validate inputs
    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error('Invalid endpoint');
    }
    if (data === undefined || data === null) {
      throw new Error('Data cannot be undefined or null');
    }

    const batchIdStr = batch_id ? String(batch_id) : '';
    const lastUpdated = new Date().toISOString();
    const dataStr = JSON.stringify(data);

    await new Promise((resolve, reject) => {
      if (!db || typeof db.transaction !== 'function') {
        reject(new Error('Database is not initialized'));
        return;
      }
      db.transaction(
        tx => {
          tx.executeSql(
            `INSERT OR REPLACE INTO ApiCache (endpoint, batch_id, data, lastUpdated)
             VALUES (?, ?, ?, ?)`,
            [endpoint, batchIdStr, dataStr, lastUpdated],
            (_, {insertId}) => {
              console.log(
                `Cached response for endpoint: ${endpoint}, batch_id: ${batchIdStr}`,
              );
              callback?.(insertId);
              resolve();
            },
            (_, error) => {
              console.error(
                `Error caching response for ${endpoint}, batch_id: ${batchIdStr}`,
                error,
              );
              reject(error || new Error('Unknown error during caching'));
            },
          );
        },
        error => {
          console.error('Transaction error during caching:', error);
          reject(error || new Error('Unknown transaction error'));
        },
      );
    });
  } catch (error) {
    console.error('cacheApiResponseForDataEntry failed:', error.message);
    callback?.(null, error);
  }
};

// Get cached API response
export const getCachedResponseForDataEntry = async (
  endpoint,
  batch_id,
  callback,
) => {
  try {
    await ensureDbInitialized();

    const batchIdStr = batch_id ? String(batch_id) : '';
    await new Promise((resolve, reject) => {
      if (!db || typeof db.transaction !== 'function') {
        reject(new Error('Database is not initialized'));
        return;
      }
      db.transaction(
        tx => {
          tx.executeSql(
            'SELECT data FROM ApiCache WHERE endpoint = ? OR batch_id = ?',
            [endpoint, batchIdStr],
            (_, {rows}) => {
              const data =
                rows.length > 0 ? JSON.parse(rows.item(0).data) : null;
              console.log(
                `Fetched cached data for endpoint: ${endpoint}, batch_id: ${batchIdStr}`,
              );

              console.log('kajshjashfjkashfkjsa', data);

              callback(data);
              resolve();
            },
            (_, error) => {
              console.error(
                `Error fetching cached response for ${endpoint}, batch_id: ${batchIdStr}`,
                error,
              );
              reject(error || new Error('Unknown error during fetch'));
            },
          );
        },
        error => {
          console.error('Transaction error during fetch:', error);
          reject(error || new Error('Unknown transaction error'));
        },
      );
    });
  } catch (error) {
    console.error('getCachedResponseForDataEntry failed:', error.message);
    callback(null);
  }
};

// Save offline data entry
export const saveOfflineDataEntryForDataEntry = async (
  data,
  endpoint,
  batch_id,
  callback,
) => {
  try {
    await ensureDbInitialized();

    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error('Invalid endpoint');
    }
    if (data === undefined || data === null) {
      throw new Error('Data cannot be undefined or null');
    }

    const batchIdStr = batch_id ? String(batch_id) : '';
    const dataStr = JSON.stringify(data);
    const createdAt = new Date().toISOString();

    await new Promise((resolve, reject) => {
      if (!db || typeof db.transaction !== 'function') {
        reject(new Error('Database is not initialized'));
        return;
      }
      db.transaction(
        tx => {
          tx.executeSql(
            `INSERT INTO OfflineDataEntries (data, endpoint, batch_id, synced, createdAt)
             VALUES (?, ?, ?, 0, ?)`,
            [dataStr, endpoint, batchIdStr, createdAt],
            (_, {insertId}) => {
              console.log(
                `Saved offline entry for endpoint: ${endpoint}, batch_id: ${batchIdStr}`,
              );
              callback?.(insertId);
              resolve();
            },
            (_, error) => {
              console.error(
                `Error saving offline entry for ${endpoint}, batch_id: ${batchIdStr}`,
                error,
              );
              reject(error || new Error('Unknown error during save'));
            },
          );
        },
        error => {
          console.error('Transaction error during save:', error);
          reject(error || new Error('Unknown transaction error'));
        },
      );
    });
  } catch (error) {
    console.error('saveOfflineDataEntryForDataEntry failed:', error.message);
    callback?.(null, error);
  }
};

// Get unsynced data entries
export const getUnsyncedDataEntriesForDataEntry = async callback => {
  try {
    await ensureDbInitialized();
    await new Promise((resolve, reject) => {
      if (!db || typeof db.transaction !== 'function') {
        reject(new Error('Database is not initialized'));
        return;
      }
      db.transaction(
        tx => {
          tx.executeSql(
            'SELECT * FROM OfflineDataEntries WHERE synced = 0',
            [],
            (_, {rows}) => {
              const data = rows.raw();
              console.log(`Fetched ${data.length} unsynced data entries`);
              callback(data);
              resolve();
            },
            (_, error) => {
              console.error('Error fetching unsynced entries:', error);
              reject(error || new Error('Unknown error during fetch'));
            },
          );
        },
        error => {
          console.error('Transaction error during unsynced fetch:', error);
          reject(error || new Error('Unknown transaction error'));
        },
      );
    });
  } catch (error) {
    console.error('getUnsyncedDataEntriesForDataEntry failed:', error.message);
    callback([]);
  }
};

// Mark data entry as synced
export const markAsSyncedForDataEntry = async id => {
  try {
    await ensureDbInitialized();
    await new Promise((resolve, reject) => {
      if (!db || typeof db.transaction !== 'function') {
        reject(new Error('Database is not initialized'));
        return;
      }
      db.transaction(
        tx => {
          tx.executeSql(
            'UPDATE OfflineDataEntries SET synced = 1 WHERE id = ?',
            [id],
            () => {
              console.log(`Marked entry ${id} as synced`);
              resolve();
            },
            (_, error) => {
              console.error(`Error marking entry ${id} as synced:`, error);
              reject(error || new Error('Unknown error during update'));
            },
          );
        },
        error => {
          console.error('Transaction error during sync update:', error);
          reject(error || new Error('Unknown transaction error'));
        },
      );
    });
  } catch (error) {
    console.error('markAsSyncedForDataEntry failed:', error.message);
  }
};
