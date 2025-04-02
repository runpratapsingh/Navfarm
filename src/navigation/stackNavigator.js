import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DrawerNavigation from './DrawerNavigation';
import SignInScreen from '../screens/auth/LoginScreen';
import SplashScreen from '../screens/Splace/SplaceScreen';
import OtpVerification from '../screens/auth/OtpVerification';
import BatchCreation from '../screens/DrawerScreens/BatchCreationScreen/BatchCreate';
import DataEntryScreen from '../screens/DrawerScreens/DataEntryScreen/CreateDataentry';
import BatchCreation1 from '../screens/DrawerScreens/BatchCreationScreen/BatchCreate1';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="splace"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        options={{headerShown: false}}
        name="splace"
        component={SplashScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="login"
        component={SignInScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="otpVerification"
        component={OtpVerification}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Drawer"
        component={DrawerNavigation}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="editDataEntry"
        component={BatchCreation}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="DataEntryScreen"
        component={DataEntryScreen}
      />
    </Stack.Navigator>
  );
}

export default MyStack;
