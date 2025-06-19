import React, {useEffect, useState} from 'react';
import {Alert, PermissionsAndroid, Platform, StyleSheet} from 'react-native';
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
import Geolocation from 'react-native-geolocation-service';

function App(): React.JSX.Element {
  const [notificationPermissionGranted, setNotificationPermissionGranted] =
    useState(false);

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

        console.log('Permission Auth', permissionGranted, authStatus1);

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
              setNotificationPermissionGranted(true);
            } catch (error) {
              console.log('Error:', error);
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
            setNotificationPermissionGranted(true);
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

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Navfarm needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert('Permission Denied', 'Location permission is required.');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      // iOS permission request
      const status = await Geolocation.requestAuthorization('whenInUse');
      if (status === 'granted') {
        getCurrentLocation();
      } else {
        Alert.alert('Permission Denied', 'Location permission is required.');
      }
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log('Latitude:', latitude, 'Longitude:', longitude);
      },
      error => {
        console.log(error.code, error.message);
        Alert.alert('Error', `Failed to get location: ${error.message}`);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    if (notificationPermissionGranted) {
      requestLocationPermission();
    }
  }, [notificationPermissionGranted]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
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
