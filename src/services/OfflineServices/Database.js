import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {name: 'NavFarm.db', location: 'default'},
  () => console.log('Database opened'),
  error => console.error('Error opening database', error),
);

export const initDatabase = () => {
  db.transaction(tx => {
    // Table for cached API responses (e.g., DataEntryList)
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS ApiCache (
        endpoint TEXT PRIMARY KEY,
        data TEXT,
        lastUpdated TEXT
      )`,
      [],
    );
    // Table for offline data entry submissions
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS OfflineDataEntries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT, -- JSON string of data entry payload
        endpoint TEXT, -- e.g., /insert_dataentry
        synced INTEGER, -- 0: unsynced, 1: synced
        createdAt TEXT
      )`,
      [],
    );
  });
};

// Cache API response
export const cacheApiResponse = (endpoint, data, callback) => {
  const lastUpdated = new Date().toISOString();
  db.transaction(tx => {
    tx.executeSql(
      `INSERT OR REPLACE INTO ApiCache (endpoint, data, lastUpdated)
       VALUES (?, ?, ?)`,
      [endpoint, JSON.stringify(data), lastUpdated],
      (_, {insertId}) => callback?.(insertId),
      (_, error) => console.error('Error caching response', error),
    );
  });
};

// Get cached API response
export const getCachedResponse = (endpoint, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT data FROM ApiCache WHERE endpoint = ?',
      [endpoint],
      (_, {rows}) => {
        const data = rows.length > 0 ? JSON.parse(rows.item(0).data) : null;
        callback(data);
      },
      (_, error) => console.error('Error fetching cached response', error),
    );
  });
};

// Save offline data entry
export const saveOfflineDataEntry = (data, endpoint, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO OfflineDataEntries (data, endpoint, synced, createdAt)
       VALUES (?, ?, 0, ?)`,
      [JSON.stringify(data), endpoint, new Date().toISOString()],
      (_, {insertId}) => callback?.(insertId),
      (_, error) => console.error('Error saving offline entry', error),
    );
  });
};

// Get unsynced data entries
export const getUnsyncedDataEntries = callback => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM OfflineDataEntries WHERE synced = 0',
      [],
      (_, {rows}) => callback(rows.raw()),
      (_, error) => console.error('Error fetching unsynced entries', error),
    );
  });
};

// Mark data entry as synced
export const markAsSynced = id => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE OfflineDataEntries SET synced = 1 WHERE id = ?',
      [id],
      () => {},
      (_, error) => console.error('Error marking as synced', error),
    );
  });
};

// Clear both NavFarm.db and NavFarmDataEntry.db
export const clearDatabases = async () => {
  let navFarmDb = null;
  let navFarmDataEntryDb = null;

  try {
    console.log('Opening NavFarm.db to clear data...');
    navFarmDb = await SQLite.openDatabase({
      name: 'NavFarm.db',
      location: 'default',
    });

    // Clear NavFarm.db
    await new Promise((resolve, reject) => {
      navFarmDb.transaction(
        tx => {
          tx.executeSql(
            'DROP TABLE IF EXISTS ApiCache',
            [],
            () => {
              console.log('Dropped ApiCache table in NavFarm.db');
            },
            (_, error) => {
              console.error(
                'Error dropping ApiCache table in NavFarm.db:',
                error,
              );
              reject(error);
            },
          );
        },
        error => {
          console.error('Transaction error in NavFarm.db:', error);
          reject(error);
        },
        () => {
          console.log('NavFarm.db transaction completed.');
          resolve();
        }, // Success callback for transaction completion
      );
    });

    console.log('Opening NavFarmDataEntry.db to clear data...');
    navFarmDataEntryDb = await SQLite.openDatabase({
      name: 'NavFarmDataEntry.db',
      location: 'default',
    });

    // Clear NavFarmDataEntry.db
    await new Promise((resolve, reject) => {
      navFarmDataEntryDb.transaction(
        tx => {
          // Execute DROP TABLE statements sequentially
          tx.executeSql(
            'DROP TABLE IF EXISTS ApiCache',
            [],
            () => {
              console.log('Dropped ApiCache table in NavFarmDataEntry.db');
            },
            (_, error) => {
              console.error(
                'Error dropping ApiCache table in NavFarmDataEntry.db:',
                error,
              );
              reject(error);
            },
          );
          tx.executeSql(
            'DROP TABLE IF EXISTS OfflineDataEntries',
            [],
            () => {
              console.log(
                'Dropped OfflineDataEntries table in NavFarmDataEntry.db',
              );
            },
            (_, error) => {
              console.error(
                'Error dropping OfflineDataEntries table in NavFarmDataEntry.db:',
                error,
              );
              reject(error);
            },
          );
        },
        error => {
          console.error('Transaction error in NavFarmDataEntry.db:', error);
          reject(error);
        },
        () => {
          console.log('NavFarmDataEntry.db transaction completed.');
          resolve();
        }, // Success callback for transaction completion
      );
    });

    console.log('All database data cleared successfully.');
  } catch (error) {
    console.error('Error clearing databases:', error.message);
    // Continue logout process even if clearing fails
  } finally {
    // Close database connections with error handling
    if (navFarmDb) {
      try {
        await new Promise((resolve, reject) => {
          navFarmDb.close(
            () => {
              console.log('NavFarm.db closed.');
              resolve();
            },
            error => {
              console.error('Error closing NavFarm.db:', error);
              reject(error);
            },
          );
        });
      } catch (closeError) {
        console.error('Error closing NavFarm.db:', closeError.message);
      }
    }

    if (navFarmDataEntryDb) {
      try {
        await new Promise((resolve, reject) => {
          navFarmDataEntryDb.close(
            () => {
              console.log('NavFarmDataEntry.db closed.');
              resolve();
            },
            error => {
              console.error('Error closing NavFarmDataEntry.db:', error);
              reject(error);
            },
          );
        });
      } catch (closeError) {
        console.error('Error closing NavFarmDataEntry.db:', closeError.message);
      }
    }
  }
};
