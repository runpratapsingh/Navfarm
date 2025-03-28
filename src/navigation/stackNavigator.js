import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import DrawerNavigation from './DrawerNavigation';
import SignInScreen from '../screens/auth/LoginScreen';
import SplashScreen from '../screens/Splace/SplaceScreen';


const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator initialRouteName='splace'>
            <Stack.Screen options={{ headerShown: false, animation: "slide_from_bottom" }} name="splace" component={SplashScreen} />
            <Stack.Screen options={{ headerShown: false, animation: "slide_from_bottom" }} name="login" component={SignInScreen} />
            <Stack.Screen options={{ headerShown: false }}
                name="Drawer" component={DrawerNavigation} />
        </Stack.Navigator>
    );
}

export default MyStack;
