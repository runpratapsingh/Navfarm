import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigation from './DrawerNavigation';
import SignInScreen from '../screens/auth/LoginScreen';
import SplashScreen from '../screens/Splace/SplaceScreen';
import OtpVerification from '../screens/auth/OtpVerification';
import BatchCreation from '../screens/DrawerScreens/BatchCreationScreen/BatchCreate';


const Stack = createStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator initialRouteName='splace'>
            <Stack.Screen options={{ headerShown: false, }} name="splace" component={SplashScreen} />
            <Stack.Screen options={{ headerShown: false, }} name="login" component={SignInScreen} />
            <Stack.Screen options={{ headerShown: false, }} name="otpVerification" component={OtpVerification} />
            <Stack.Screen options={{ headerShown: false }}
                name="Drawer" component={DrawerNavigation} />
            <Stack.Screen options={{ headerShown: false, }} name="editDataEntry" component={BatchCreation} />

        </Stack.Navigator>
    );
}

export default MyStack;
