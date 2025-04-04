import React, {use, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import {DrawerItemList} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {COLORS} from '../theme/theme';
import {logout} from '../utils/UtilsFn/Logout';
import {appStorage} from '../utils/services/StorageHelper';

const CustomDrawerContent = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      setModalVisible(false); // Hide modal after successful logout
    } catch (error) {
      console.error('Logout error:', error);
    }
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
  }, []);

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
        onPress={() => setModalVisible(true)}>
        <View style={styles.logoutIconContainer}>
          <Icon name="sign-out-alt" size={25} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Icon
              name="exclamation-circle"
              size={40}
              color="#ff4c4c"
              style={styles.modalIcon}
            />
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalText}>
              Are you sure you want to logout?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout}>
                <Text style={[styles.modalButtonText, styles.confirmText]}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },

  modalIcon: {
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },

  modalText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 25,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
  },

  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },

  confirmButton: {
    backgroundColor: '#ff4c4c',
    borderColor: '#ff4c4c',
  },

  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  confirmText: {
    color: '#fff',
  },
});

export default CustomDrawerContent;
