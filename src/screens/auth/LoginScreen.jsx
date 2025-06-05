import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {COLORS, FONTFAMILY} from '../../theme/theme';
import PhoneInput from 'react-native-international-phone-number';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../components/CustumButton';
import {requireImage} from '../../utils/JSON/Images';
import {API_ENDPOINTS, AUTH_HEADERS} from '../../Apiconfig/Apiconfig';
import axios from 'axios';
import api from '../../Apiconfig/ApiconfigWithInterceptor';
import {appStorage} from '../../utils/services/StorageHelper';
import ErrorModal from '../../components/CustumModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {initDatabase} from '../../services/OfflineServices/Database';
import {initDatabaseForDataEntry} from '../../services/OfflineServices/DataentryOfflineDB';

const SignInScreen = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isSignInEnabled, setIsSignInEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const initializeDatabases = useCallback(async () => {
    try {
      await initDatabase();
      await initDatabaseForDataEntry();
      // navigation.replace('CategorySelection');
    } catch (error) {
      console.error('Error initializing databases:', error);
    }
  }, [navigation]);

  useEffect(() => {
    checkFormValidity();
  }, [inputValue, password, rememberMe]);

  const handleInputValue = useCallback(phoneNumber => {
    console.log('Country code', phoneNumber);
    setInputValue(phoneNumber);
  }, []);

  const handleSelectedCountry = useCallback(country => {
    console.log('Country code', country);
    setSelectedCountry(country);
  }, []);

  const handlePasswordChange = useCallback(text => {
    setPassword(text);
  }, []);

  const handleRememberMeChange = useCallback(() => {
    setRememberMe(prev => !prev);
  }, []);

  const checkFormValidity = useCallback(() => {
    const isValid =
      inputValue.trim() !== '' && password.trim() !== '' && rememberMe;
    console.log('Form Validity Check:', {
      inputValue,
      password,
      rememberMe,
      isValid,
    });
    setIsSignInEnabled(isValid);
  }, [inputValue, password, rememberMe]);

  const handleSignIn = useCallback(async () => {
    setLoading(true); // Set loading to true before API call
    try {
      const phoneNumberWithoutSpaces = inputValue.replace(/\s+/g, '');
      const formattedPhoneNumber = `${selectedCountry?.callingCode}${phoneNumberWithoutSpaces}`;

      const config = {
        method: 'post',
        url: API_ENDPOINTS.LOGIN,
        headers: AUTH_HEADERS,
        data: {
          mobile_no: String(formattedPhoneNumber),
          password: String(password),
          social_id: null,
          signinwithotp: false,
        },
      };
      const response = await axios(config);
      if (response.data?.status === 'success') {
        const userData = response.data.data?.login[0];

        if (userData) {
          await appStorage.setUserData(userData);
          await appStorage.setAuthToken(userData.token);
          console.log('User data stored successfully:', userData);
          const storedToken = await appStorage.getAuthToken();
          if (storedToken) {
            await fetchCommonDetails(userData.companY_ID, userData.useR_ID);
          }
        }
      } else {
        setErrorMessage(response.data?.message || 'Something went wrong');
        setErrorVisible(true);
      }
      console.log('Login successful:', response.data);
    } catch (error) {
      if (error.response) {
        console.error(
          'Server responded with:',
          error.response.status,
          error.response.data,
        );
        throw new Error(error.response.data.message || 'Login failed');
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('No response from server. Please try again later.');
      } else {
        console.error('Error setting up request:', error.message);
        throw new Error('Unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false); // Set loading to false after API call
    }
  }, [inputValue, password, selectedCountry, navigation]);

  const fetchCommonDetails = useCallback(
    async (companyId, userId) => {
      try {
        const response = await api.get(API_ENDPOINTS.COMMON_DETAILS, {
          params: {
            company_id: companyId,
            user_id: userId,
          },
        });
        console.log('Common details fetched:', response.data);
        if (response?.data?.status === 'success') {
          const commonDetails = response.data.data.common_details[0];
          await appStorage.setCommonDetails(commonDetails);
          console.log('Common details stored successfully:', commonDetails);
          if (commonDetails) {
            // await initializeDatabases();
            navigation.replace('CategorySelection');
          }
        }
      } catch (error) {
        console.error('Error fetching common details:', error);
      }
    },
    [navigation],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled">
            <View style={styles.innerContainer}>
              <View style={styles.logoParentContainer}>
                <View style={styles.logoContainer}>
                  <Image
                    source={requireImage.logoImage}
                    style={{width: '100%', height: '100%'}}
                  />
                </View>
              </View>
              <Text style={styles.title}>Sign in to your account</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <PhoneInput
                  value={inputValue}
                  defaultCountry={'IN'}
                  onChangePhoneNumber={handleInputValue}
                  selectedCountry={selectedCountry}
                  onChangeSelectedCountry={handleSelectedCountry}
                  placeholder="Enter phone number"
                  phoneInputStyles={{
                    container: {
                      width: '100%',
                      marginVertical: 5,
                      marginBottom: 10,
                      height: 55,
                      borderWidth: 1,
                      borderColor: '#ddd',
                      borderRadius: 5,
                      input: {
                        fontSize: 16,
                        fontFamily: FONTFAMILY.regular,
                      },
                    },
                  }}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Icon
                    name="lock"
                    size={18}
                    color="#666"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}>
                    <Icon
                      name={showPassword ? 'eye-slash' : 'eye'}
                      size={18}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.linkText}>Forget password?</Text>
              </TouchableOpacity>
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={handleRememberMeChange}>
                  <Icon
                    name={rememberMe ? 'check-square' : 'square'}
                    size={20}
                    color={rememberMe ? '#4a90e2' : '#666'}
                  />
                </TouchableOpacity>
                <Text style={styles.agreementText}>
                  I have read and agreed to{' '}
                  <Text style={styles.boldText}>User Agreement</Text> and{' '}
                  <Text style={styles.boldText}>Privacy Policy</Text>
                </Text>
              </View>
              <View style={styles.divider} />
              <CustomButton
                title={loading ? 'Signing in...' : 'Sign in'}
                onPress={handleSignIn}
                disabled={!isSignInEnabled || loading}
              />
              <View style={styles.divider} />
              <View style={styles.socialIconsContainer}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => {}}>
                  <Icon name="google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => {}}>
                  <Icon name="facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
              <View style={styles.createAccountContainer}>
                <Text style={styles.createAccountText}>
                  Don't have an account?{' '}
                </Text>
                <TouchableOpacity>
                  <Text style={[styles.linkText, styles.boldText]}>
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <ErrorModal
        visible={errorVisible}
        onClose={() => setErrorVisible(false)}
        message={errorMessage}
        type="error"
      />
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
    paddingBottom: 40,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: FONTFAMILY.bold,
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
    fontFamily: FONTFAMILY.regular,
  },
  logoContainer: {
    height: 63,
    width: 100,
  },
  logoParentContainer: {
    alignItems: 'center',
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
    fontFamily: FONTFAMILY.regular,
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
  checkbox: {},
  agreementText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
    flexShrink: 1,
    fontFamily: FONTFAMILY.regular,
  },
  boldText: {
    fontFamily: FONTFAMILY.bold,
    color: '#4a90e2',
  },
  signInButton: {
    backgroundColor: COLORS.primaryColor,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  signInButtonDisabled: {
    backgroundColor: '#ccc',
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTFAMILY.semibold,
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  createAccountText: {
    color: '#666',
    fontFamily: FONTFAMILY.regular,
  },
  linkText: {
    color: '#4a90e2',
    fontFamily: FONTFAMILY.semibold,
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
    borderColor: 'black',
  },
});

export default SignInScreen;
