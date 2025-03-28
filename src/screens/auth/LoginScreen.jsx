import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { COLORS } from '../../theme/theme';
import PhoneInput from "react-native-international-phone-number";
import { SvgXml } from 'react-native-svg';
import { SvgxmlIMages } from '../../utils/Svgxml';
import { useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isSignInEnabled, setIsSignInEnabled] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    checkFormValidity();
  }, [inputValue, password, rememberMe]);

  function handleInputValue(phoneNumber) {
    console.log("Country code", phoneNumber);
    setInputValue(phoneNumber);
  }

  function handleSelectedCountry(country) {
    console.log("Country code", country);
    setSelectedCountry(country);
  }

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const checkFormValidity = () => {
    const isValid = inputValue.trim() !== "" && password.trim() !== "" && rememberMe;
    console.log("Form Validity Check:", { inputValue, password, rememberMe, isValid });
    setIsSignInEnabled(isValid);
  };

  const handleSignIn = () => {
    // Collect form data
    const formData = {
      email,
      password,
      phoneNumber: inputValue,
      rememberMe
    };

    // Display form data (for demonstration purposes)
    // Alert.alert('Form Data', JSON.stringify(formData, null, 2));
    navigation.navigate('Drawer')
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.innerContainer}>
              <View style={styles.logoContainer}>
                <SvgXml xml={SvgxmlIMages.logo} height={100} width={100} />
              </View>

              <Text style={styles.title}>Sign in to your account</Text>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <PhoneInput
                  value={inputValue}
                  defaultCountry={"IN"}
                  onChangePhoneNumber={handleInputValue}
                  selectedCountry={selectedCountry}
                  onChangeSelectedCountry={handleSelectedCountry}
                  placeholder="Enter phone number"
                  phoneInputStyles={{
                    container: {
                      width: "100%",
                      marginVertical: 5,
                      marginBottom: 10,
                      height: 55,
                      borderWidth: 1,
                      borderColor: COLORS.inputBorderColor,
                      borderRadius: 10,
                    },
                  }}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="lock" size={18} color="#666" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon name={showPassword ? "eye-slash" : "eye"} size={18} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.linkText}>Forget password?</Text>
              </TouchableOpacity>

              {/* Remember Me and Agreements */}
              <View style={styles.checkboxContainer}>
                <TouchableOpacity onPress={handleRememberMeChange}>
                  <Icon
                    name={rememberMe ? "check-square" : "square"}
                    size={20}
                    color={rememberMe ? "#4a90e2" : "#666"}
                  />
                </TouchableOpacity>
                <Text style={styles.agreementText}>
                  I have read and agreed to <Text style={styles.boldText}>User Agreement</Text> and <Text style={styles.boldText}>Privacy Policy</Text>
                </Text>
              </View>

              <View style={styles.divider} />

              {/* Sign In Button */}
              <TouchableOpacity
                style={[styles.signInButton, !isSignInEnabled && styles.signInButtonDisabled]}
                onPress={handleSignIn}
                disabled={!isSignInEnabled}
              >
                <Text style={styles.signInButtonText}>Sign in</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Alternative Sign In Methods */}
              <View style={styles.socialIconsContainer}>
                <TouchableOpacity style={styles.socialButton} onPress={() => { }}>
                  <Icon name="google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton} onPress={() => { }}>
                  <Icon name="facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              {/* Create Account */}
              <View style={styles.createAccountContainer}>
                <Text style={styles.createAccountText}>Don't have an account? </Text>
                <TouchableOpacity>
                  <Text style={[styles.linkText, styles.boldText]}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40, // Add extra padding at the bottom
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  agreementText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
    flexShrink: 1,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  signInButton: {
    backgroundColor: COLORS.primaryColor,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  signInButtonDisabled: {
    backgroundColor: '#ccc', // Change this to your desired disabled color
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  createAccountText: {
    color: '#666',
  },
  linkText: {
    color: '#4a90e2',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "black",
  },
});

export default SignInScreen;
