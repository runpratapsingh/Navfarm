/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {StyleSheet, Text} from 'react-native';
import MyStack from './src/navigation/stackNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/utils/services/NavigationService';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {
  cacheApiResponse,
  initDatabase,
} from './src/services/OfflineServices/Database';
import {initDatabaseForDataEntry} from './src/services/OfflineServices/DataentryOfflineDB';

function App(): React.JSX.Element {
  useEffect(() => {
    // Initialize databases sequentially to avoid conflicts
    const initializeDatabases = async () => {
      try {
        await initDatabase();
        await initDatabaseForDataEntry();
      } catch (error) {
        console.error('Error initializing databases:', error);
      }
    };
    initializeDatabases();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <MyStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
