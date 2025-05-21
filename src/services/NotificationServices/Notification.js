import notifee, {AndroidImportance} from '@notifee/react-native';

export const onDisplayNotification = async (title, body) => {
  // Request permission for notifications (only ask once)
  const permissionGranted = await notifee.requestPermission();

  if (permissionGranted) {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        sound: 'sound',
        pressAction: {
          id: 'default', // Ensures the app opens when the notification is tapped
        },
      },
      ios: {
        // iOS specific notification options
        sound: 'sound.wav',
        badge: 1, // Example to set badge number (optional)
      },
    });
  } else {
    console.log('Notification permission not granted');
  }
};

export const intitialnotification = async () => {
  // Request permission for notifications (only ask once)
  const permissionGranted = await notifee.requestPermission();

  if (permissionGranted) {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
      importance: AndroidImportance.HIGH,
    });

    // Display a welcome notification
    await notifee.displayNotification({
      title: 'Welcome to the app',
      body: 'This is the first notification',
      android: {
        channelId,
        pressAction: {
          id: 'default', // Ensures the app opens when the notification is tapped
        },
      },
      ios: {
        // iOS specific notification options
        sound: 'default',
        badge: 1, // Example to set badge number (optional)
      },
    });
  } else {
    console.log('Notification permission not granted');
  }
};
