import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon library


const Drawer = createDrawerNavigator();

function DrawerNavigation() {
    return (
        <Drawer.Navigator screenOptions={{
            headerShown: false,
            drawerStyle: {
                backgroundColor: "blue",
                borderTopRightRadius:0,
                borderBottomRightRadius:0,
                paddingHorizontal: 0, // Remove horizontal padding
            },
        }} initialRouteName="Home1"
            drawerContent={(props) => <CustomDrawerContent {...props} />}

        >
            <Drawer.Screen name="Home1" options={{
                drawerItemStyle: { backgroundColor: '#e0e0e0', borderRadius: 5, marginVertical: 5,marginRight:0 },
                drawerLabelStyle: {  color: '#007aff', fontSize: 16 },
                drawerIcon: ({ color, size }) => (
                    <Icon name="analytics-outline" color={color} size={size} />
                  ),
            }} component={HomeScreen} />
            <Drawer.Screen name="Another" options={{
                drawerItemStyle: { backgroundColor: '#e0e0e0', borderRadius: 5, marginVertical: 5 },
                drawerLabelStyle: { color: '#007aff', fontSize: 16 },
            }} component={HomeScreen} />
        </Drawer.Navigator>
    );
}

export default DrawerNavigation;
