import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';

export const logout = async navigation => {
  await AsyncStorage.removeItem('authToken'); // Remove access token

  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: 'LoginScreen'}], // Navigate to Login
    }),
  );
};
