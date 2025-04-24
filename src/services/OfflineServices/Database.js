import SQLite from 'react-native-sqlite-storage';
import {initDatabaseForDataEntry} from './DataentryOfflineDB';

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

// Function to open a database and return the database object
const openDatabase = dbName => {
  return new Promise((resolve, reject) => {
    SQLite.openDatabase(
      {name: dbName, location: 'default'},
      db => resolve(db),
      error => reject(new Error(`Error opening ${dbName}: ${error.message}`)),
    );
  });
};

// Function to close a database
const closeDatabase = db => {
  return new Promise((resolve, reject) => {
    db.close(
      () => resolve(),
      error => reject(new Error(`Error closing database: ${error.message}`)),
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

const initializeDatabases = async () => {
  try {
    await initDatabase();
    await initDatabaseForDataEntry();
  } catch (error) {
    console.error('Error initializing databases:', error);
  }
};

// Function to delete all data from a table in a database
const deleteAllDataFromTable = (db, tableName) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          `DELETE FROM ${tableName}`,
          [],
          () => resolve(),
          (_, error) =>
            reject(
              new Error(
                `Error deleting data from ${tableName}: ${error.message}`,
              ),
            ),
        );
      },
      error => reject(new Error(`Transaction error: ${error.message}`)),
    );
  });
};

// Clear all data from both NavFarm.db and NavFarmDataEntry.db
export const clearDatabases = async () => {
  let navFarmDb = null;
  let navFarmDataEntryDb = null;

  try {
    console.log('Opening NavFarm.db to clear data...');
    navFarmDb = await openDatabase('NavFarm.db');

    // Clear data from NavFarm.db
    await deleteAllDataFromTable(navFarmDb, 'ApiCache');
    console.log('Deleted all data from ApiCache table in NavFarm.db');

    console.log('Opening NavFarmDataEntry.db to clear data...');
    navFarmDataEntryDb = await openDatabase('NavFarmDataEntry.db');

    // Clear data from NavFarmDataEntry.db
    await deleteAllDataFromTable(navFarmDataEntryDb, 'ApiCache');
    console.log('Deleted all data from ApiCache table in NavFarmDataEntry.db');

    await deleteAllDataFromTable(navFarmDataEntryDb, 'OfflineDataEntries');
    console.log(
      'Deleted all data from OfflineDataEntries table in NavFarmDataEntry.db',
    );

    console.log('All database data cleared successfully.');
  } catch (error) {
    console.error('Error clearing databases:', error.message);
    // Continue logout process even if clearing fails
  } finally {
    initializeDatabases();
  }
};
