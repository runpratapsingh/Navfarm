import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import DrawerNavigation from './DrawerNavigation';


const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen options={{ headerShown: false, animation: "slide_from_bottom" }}
                name="Drawer" component={DrawerNavigation} />
        </Stack.Navigator>
    );
}

export default MyStack;
