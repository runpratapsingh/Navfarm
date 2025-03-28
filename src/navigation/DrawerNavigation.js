import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import Icon from 'react-native-vector-icons/FontAwesome5';


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
        }} initialRouteName="Home"
            drawerContent={(props) => <CustomDrawerContent {...props} />}

        >
            <Drawer.Screen name="Home" options={{
                drawerItemStyle: { backgroundColor: '#e0e0e0', borderRadius: 5, marginVertical: 5,marginRight:0 },
                drawerLabelStyle: {  color: '#007aff', fontSize: 16 },
                drawerLabel:"Data Entry",
                drawerIcon: ({ color, size }) => (
                    <Icon name="layer-group" color="#000000" size={20} />
                ),
            }} component={HomeScreen} />

        </Drawer.Navigator>
    );
}

export default DrawerNavigation;
