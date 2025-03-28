import * as React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { COLORS } from '../theme/theme';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar backgroundColor={COLORS.primaryColor} barStyle={'light-content'} />
      <Text style={{fontSize:20}}>Data Entry screen</Text>
  
    </View>
  );
}
