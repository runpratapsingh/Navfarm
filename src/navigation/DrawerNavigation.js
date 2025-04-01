import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../components/CustomDrawerContent';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DataEntryScreen from '../screens/DrawerScreens/DataEntryScreen/DataEntry';
import BatchCreationScreen from '../screens/DrawerScreens/BatchCreationScreen/BatchCreate';


const Drawer = createDrawerNavigator();

function DrawerNavigation() {
    return (
        <Drawer.Navigator screenOptions={{
            // headerShown: false,
            drawerStyle: {
                borderTopRightRadius:0,
                borderBottomRightRadius:0,
                paddingHorizontal: 0, // Remove horizontal padding
            },
        }} initialRouteName="DataEntry"
            drawerContent={(props) => <CustomDrawerContent {...props} />}

        >
            <Drawer.Screen name="DataEntry" options={{
                drawerItemStyle: { backgroundColor: '#e0e0e0', borderRadius: 5, marginVertical: 5,marginRight:0 },
                drawerLabelStyle: {  color: '#007aff', fontSize: 16 },
                drawerLabel:"Data Entry",
                drawerIcon: ({ color, size }) => (
                    <Icon name="layer-group" color="#000000" size={20} />
                ),
                headerShown: false,
            }} component={DataEntryScreen} />
               <Drawer.Screen name="BatchCreation" options={{
                drawerItemStyle: { backgroundColor: '#e0e0e0', borderRadius: 5, marginVertical: 5,marginRight:0 },
                drawerLabelStyle: {  color: '#007aff', fontSize: 16 },
                drawerLabel:"Batch Creation",
                drawerIcon: ({ color, size }) => (
                    <Icon name="layer-group" color="#000000" size={20} />
                ),
                headerShown: false,
            }} component={BatchCreationScreen} />

        </Drawer.Navigator>
    );
}

export default DrawerNavigation;
