import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, Animated, StatusBar } from "react-native";
import { SvgxmlIMages } from "../../utils/Svgxml";
import { SvgXml } from "react-native-svg";
import { COLORS } from "../../theme/theme";

const SplashScreen = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      navigation.replace("login"); // Change "Home" to your main screen name
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryColor} />
      <Animated.View style={{ opacity: fadeAnim,justifyContent: "center",alignItems: "center" }}>
        {/* <Image source={require("../assets/logo.png")} style={styles.logo} />
         */}
        <SvgXml xml={SvgxmlIMages.logo} height={100} width={100}  />
        <Text style={styles.text}>Welcome to Navfarm</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    fontWeight: "bold",
    color: "#333",
  },
});

export default SplashScreen;
