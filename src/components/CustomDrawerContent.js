import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const CustomDrawerContent = (props) => {
  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} // Replace with your image URL
            style={styles.userImage}
          />
          <Text style={styles.userName}>User Name</Text>
        </View>
        <View style={styles.drawerItemList}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContent: {
    paddingTop: 20,
    paddingHorizontal: 0, // Remove horizontal padding
  },
  userInfoSection: {
    width: '100%', // Ensure full width
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
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
    color: '#333',
  },
  drawerItemList: {
    width: '100%', // Ensure full width
    marginTop: 20,
  },
});

export default CustomDrawerContent;
