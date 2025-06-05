/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {PermissionsAndroid, Platform, StyleSheet} from 'react-native';
import MyStack from './src/navigation/stackNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './src/utils/services/NavigationService';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import {initDatabase} from './src/services/OfflineServices/Database';
import {initDatabaseForDataEntry} from './src/services/OfflineServices/DataentryOfflineDB';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {onDisplayNotification} from './src/services/NotificationServices/Notification';

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

  const requestUserPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        // Request notification permissions using Notifee
        const permissionGranted = await notifee.requestPermission();
        const authStatus1 = await messaging().hasPermission();
        if (authStatus1 !== messaging.AuthorizationStatus.AUTHORIZED) {
          await messaging().requestPermission();
        }

        console.log(
          'djadjkagfjakgfagfahsgfhf Permission Auth',
          permissionGranted,
          authStatus1,
        );

        messaging()
          .getAPNSToken()
          .then(apnsToken => {
            console.log('APNS Token:', apnsToken || 'No APNS Token found');
          })
          .catch(error => {
            console.error('Error fetching APNS Token:', error);
          });

        if (permissionGranted) {
          console.log('iOS Notification permissions granted.=======');

          // Request FCM permission
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

          if (enabled) {
            console.log('FCM authorization status:------', authStatus);

            try {
              await messaging().onTokenRefresh(token => {
                console.log('New FCM Token:', token);
              });

              const token = await messaging().getToken();
              console.log('FCM token (iOS):', token);
              await AsyncStorage.setItem('fcmToken', token);
            } catch (error) {
              console.log('Yyyyyyyyyyyyyyyy', error);
            }
          } else {
            console.log('iOS Notification permissions not granted.');
          }
        } else {
          console.log('iOS Notification permissions denied.');
        }
      } else {
        // For Android
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        if (permission === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Android Notification permission granted.');
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

          if (enabled) {
            console.log('FCM authorization status:', authStatus);
            const token = await messaging().getToken();
            console.log('FCM token (Android):', token);
            await AsyncStorage.setItem('fcmToken', token);
          } else {
            console.log('Android Notification permissions not granted.');
          }
        } else {
          console.log('Android Notification permission denied.');
        }
      }
    } catch (error) {
      console.log('Error requesting user permissions:', error);
    }
  };

  useEffect(() => {
    requestUserPermission();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      // return;
      const unsubscribeIos = messaging().onMessage(async remoteMessage => {
        console.log('Foreground FCM message (iOS):', remoteMessage);
        await onDisplayNotification(
          remoteMessage?.notification?.title || 'No Title',
          remoteMessage?.notification?.body || 'No Body',
        );
      });

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Background FCM message (iOS):', remoteMessage);
      });

      return unsubscribeIos;
    } else {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('Foreground FCM message:', remoteMessage);
        await onDisplayNotification(
          remoteMessage?.notification?.title || 'No Title',
          remoteMessage?.notification?.body || 'No Body',
        );
      });

      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Background FCM message:', remoteMessage);
      });

      return unsubscribe;
    }
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
