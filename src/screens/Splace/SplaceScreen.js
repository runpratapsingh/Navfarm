import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet, Animated, StatusBar} from 'react-native';
import {COLORS} from '../../theme/theme';
import {requireImage} from '../../utils/JSON/Images';
import {appStorage} from '../../utils/services/StorageHelper';

const SplashScreen = ({navigation}) => {
  const fadeAnim = new Animated.Value(0);
  const checkAuth = async () => {
    try {
      const userData = await appStorage.getUserData();
      if (userData) {
        navigation.replace('CategorySelection'); // Navigate to Home if logged in
      } else {
        navigation.replace('login'); // Navigate to Sign-in if not logged in
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      navigation.replace('SignInScreen');
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      checkAuth(); // Check authentication after the animation
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primaryColor}
      />
      <Animated.View
        style={{
          opacity: fadeAnim,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={styles.logoContainer}>
          <Image
            source={requireImage.SplaceLogo}
            style={{width: '100%', height: '100%'}}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: "#fff",
    backgroundColor: COLORS.primaryColor,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logoContainer: {
    height: 150,
    width: 150,
  },
});

export default SplashScreen;
