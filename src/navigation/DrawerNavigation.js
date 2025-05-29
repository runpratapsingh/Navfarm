import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerContent from '../components/CustomDrawerContent';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DataEntryScreen from '../screens/DrawerScreens/DataEntryScreen/DataEntry';
import BatchCreation from '../screens/DrawerScreens/DailyDataEntryScreen/DailyDataEntry';
import HomeScreen from '../screens/DrawerScreens/Home/HomeScreen';
import Dashboard from '../screens/DrawerScreens/DashBoard/Dashboard';
import BottomNavigation from './BottomNavigation';
import {TabProvider} from '../hooks/TabContext';
import {FONTFAMILY} from '../theme/theme';

const Drawer = createDrawerNavigator();

function DrawerNavigation() {
  return (
    <TabProvider>
      <Drawer.Navigator
        screenOptions={{
          // headerShown: false,
          drawerStyle: {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            paddingHorizontal: 0, // Remove horizontal padding
          },
        }}
        initialRouteName="BottomNavigation"
        drawerContent={props => <CustomDrawerContent {...props} />}>
        {/* <Drawer.Screen
          name="Dashboard"
          options={{
            drawerItemStyle: {
              backgroundColor: '#e0e0e0',
              borderRadius: 5,
              marginVertical: 5,
              marginRight: 0,
            },
            drawerLabelStyle: {
              color: '#007aff',
              fontSize: 16,
              fontFamily: FONTFAMILY.semibold,
            },
            drawerLabel: 'Dashboard',
            drawerIcon: ({color, size}) => (
              <Icon name="tachometer-alt" color="#000000" size={20} />
            ),
            headerShown: false,
          }}
          component={Dashboard}
        />
        <Drawer.Screen
          name="Home"
          options={{
            drawerItemStyle: {
              backgroundColor: '#e0e0e0',
              borderRadius: 5,
              marginVertical: 5,
              marginRight: 0,
            },
            drawerLabelStyle: {
              color: '#007aff',
              fontSize: 16,
              fontFamily: FONTFAMILY.semibold,
            },
            drawerLabel: 'Home',
            drawerIcon: ({color, size}) => (
              <Icon name="home" color="#000000" size={20} />
            ),
            headerShown: false,
          }}
          component={HomeScreen}
        />
        <Drawer.Screen
          name="DataEntry"
          options={{
            drawerItemStyle: {
              backgroundColor: '#e0e0e0',
              borderRadius: 5,
              marginVertical: 5,
              marginRight: 0,
            },
            drawerLabelStyle: {
              color: '#007aff',
              fontSize: 16,
              fontFamily: FONTFAMILY.semibold,
            },
            drawerLabel: 'Data Entry',
            drawerIcon: ({color, size}) => (
              <Icon name="keyboard" color="#000000" size={20} />
            ),
            headerShown: false,
          }}
          component={DataEntryScreen}
        />
        <Drawer.Screen
          name="BatchCreation"
          options={{
            drawerItemStyle: {
              backgroundColor: '#e0e0e0',
              borderRadius: 5,
              marginVertical: 5,
              marginRight: 0,
            },
            drawerLabelStyle: {
              color: '#007aff',
              fontSize: 16,
              fontFamily: FONTFAMILY.semibold,
            },
            drawerLabel: 'Batch Creation',
            drawerIcon: ({color, size}) => (
              <Icon name="object-group" color="#000000" size={20} />
            ),
            headerShown: false,
          }}
          component={BatchCreation}
        /> */}
        <Drawer.Screen
          name="BottomNavigation"
          options={{
            drawerItemStyle: {
              backgroundColor: '#e0e0e0',
              borderRadius: 5,
              marginVertical: 5,
              marginRight: 0,
            },
            drawerLabelStyle: {
              color: '#007aff',
              fontSize: 16,
              fontFamily: FONTFAMILY.semibold,
            },
            drawerLabel: 'BottomNavigation',
            drawerIcon: ({color, size}) => (
              <Icon name="object-group" color="#000000" size={20} />
            ),
            headerShown: false,
          }}
          component={BottomNavigation}
        />
      </Drawer.Navigator>
    </TabProvider>
  );
}

export default DrawerNavigation;
