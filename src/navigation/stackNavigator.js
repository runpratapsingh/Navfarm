import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import DrawerNavigation from './DrawerNavigation';
import SignInScreen from '../screens/auth/LoginScreen';
import SplashScreen from '../screens/Splace/SplaceScreen';
import OtpVerification from '../screens/auth/OtpVerification';
import CategorySelection from '../screens/CategorySelectionScreen/CategorySelection';
import EditDataEntry from '../screens/DrawerScreens/DataEntryScreen/DataEntry/EditDataEntry';
import DataEntryScreen from '../screens/DrawerScreens/DataEntryScreen/DataEntry';
import LineDetailScreen from '../screens/DrawerScreens/DataEntryScreen/DataEntry/LineDetails';

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
        component={EditDataEntry}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="DataEntryScreen"
        component={DataEntryScreen}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="CategorySelection"
        component={CategorySelection}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="LineDetailScreen"
        component={LineDetailScreen}
      />
    </Stack.Navigator>
  );
}

export default MyStack;
