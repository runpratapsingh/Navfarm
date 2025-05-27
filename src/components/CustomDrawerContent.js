import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from 'react-native';
import {DrawerItemList} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {COLORS, FONTFAMILY} from '../theme/theme';
import {logout} from '../utils/UtilsFn/Logout';
import {appStorage} from '../utils/services/StorageHelper';
import ConfirmLogoutAndExitModal from './ExitAndLogoutModalComp';

const CustomDrawerContent = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout();
      setModalVisible(false);
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}], // Adjust to your login screen name
      });
    } catch (error) {
      console.error('LsetTitleogout error:', error);
    }
  };

  const handleExitApp = () => {
    setModalVisible(false);
    BackHandler.exitApp(); // Exit the app
  };

  const handleBackPress = () => {
    const navState = navigation.getState();
    const stackLength = navState?.routes.length || 0;

    console.log('Stack Length:', stackLength); // Debugging log
    console.log('Current Route:', navState?.routes[navState.index]?.name); // Debugging log

    if (stackLength <= 1) {
      console.log(`Back button pressed on the last screen`); // Debugging log

      // Only one screen in the stack
      setModalVisible(true); // Show modal before exiting
      setTitle('Exit App');
      setMessage('Are you sure you want to exit the app?');
      setButtonText('Exit');
      return true; // Prevent default back action
    }
    return false; // Allow default back navigation
  };

  const getUserName = async () => {
    try {
      const userData = await appStorage.getUserData();
      if (userData !== null) {
        setUserName(userData.name);
      }
    } catch (error) {
      console.error('Error retrieving user name:', error);
    }
  };

  useEffect(() => {
    getUserName(); // Fetch user name when component mounts

    // Add back press listener for Android
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
    return () => backHandler.remove(); // Cleanup listener
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            }}
            style={styles.userImage}
          />
          <Text style={styles.userName}>{userName || ''}</Text>
        </View>
        <View style={styles.drawerItemList}>
          <DrawerItemList {...props} />
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          setModalVisible(true); // Show modal on logout press
          setTitle('Logout');
          setMessage('Are you sure you want to logout?');
          setButtonText('Logout');
        }} // Show modal on logout press
      >
        <View style={styles.logoutIconContainer}>
          <Icon name="sign-out-alt" size={25} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </View>
      </TouchableOpacity>

      <ConfirmLogoutAndExitModal
        visible={modalVisible}
        title={title}
        message={message}
        buttonText={buttonText}
        onClose={() => setModalVisible(false)}
        onConfirm={title === 'Logout' ? handleLogout : handleExitApp} // Exit app on confirm
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingVertical: 20,
    alignItems: 'center',
    marginHorizontal: 0,
    backgroundColor: COLORS.primaryColor,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: FONTFAMILY.bold,
    color: '#fff',
  },
  drawerItemList: {
    width: '100%', // Ensure full width
  },
  logoutButton: {
    padding: 15,
    backgroundColor: '#ff4c4c',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTFAMILY.bold,
    marginLeft: 10,
  },
});

export default CustomDrawerContent;
