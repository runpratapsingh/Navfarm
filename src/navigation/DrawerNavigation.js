import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerContent from '../components/CustomDrawerContent';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {FONTFAMILY} from '../theme/theme';
import BottomNavigation from './BottomNavigation';
import {TabProvider} from '../hooks/TabContext';
import BatchComparison from '../screens/DrawerScreens/BatchComparison/Batch_Comparison_screen';

const Drawer = createDrawerNavigator();

function DrawerNavigation() {
  return (
    <TabProvider>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            paddingHorizontal: 0,
          },
        }}
        initialRouteName="Dashboard"
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="Dashboard"
          component={BottomNavigation}
          initialParams={{activeTab: 'Dashboard'}}
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
        />
        <Drawer.Screen
          name="DataEntry"
          component={BottomNavigation}
          initialParams={{activeTab: 'DataEntry'}}
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
        />
        <Drawer.Screen
          name="Daily Data Entry"
          component={BottomNavigation}
          initialParams={{activeTab: 'Daily Data Entry'}}
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
            drawerLabel: 'Multi Batch Entry',
            drawerIcon: ({color, size}) => (
              <Icon name="object-group" color="#000000" size={20} />
            ),
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="Categories"
          component={BottomNavigation}
          initialParams={{activeTab: 'Categories'}}
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
            drawerLabel: 'Categories',
            drawerIcon: ({color, size}) => (
              <Icon name="layer-group" color="#000000" size={20} />
            ),
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="BatchComparison"
          component={BatchComparison}
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
            drawerLabel: 'Batch Comparison',
            drawerIcon: ({color, size}) => (
              <Icon name="yin-yang" color="#000000" size={20} />
            ),
            headerShown: false,
          }}
        />
      </Drawer.Navigator>
    </TabProvider>
  );
}

export default DrawerNavigation;
