import React from 'react';
import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';

const Loader = ({visible}) => {
  if (!visible) return null;

  return (
    <View style={styles.loaderContainer}>
      <LottieView
        source={require('./lottie.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  lottie: {
    width: 200,
    height: 200,
  },
});

export default Loader;
