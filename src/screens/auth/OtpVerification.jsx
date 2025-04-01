import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { SvgXml } from "react-native-svg";
import { SvgxmlIMages } from "../../utils/Svgxml";
import CustomButton from "../../components/CustumButton";
import { useNavigation } from "@react-navigation/native";
const { height, width } = Dimensions.get("window");

const OTPVerificationScreen = ({ route }) => {
    const [otp, setOtp] = useState("");
    const navigation = useNavigation();
    console.log("OTP Verification Screen", route.params);
    const { phoneNumber } = route.params; // Extract phone number from route params
    const handleOtpVerification = () => {
        console.log("OTP Submitted:", otp);
        navigation.replace("Drawer"); // Navigate to home screen after OTP verification

    }

    return (
        <View style={styles.container}>
            <SvgXml xml={SvgxmlIMages.OTP} height={width * 0.5} width={width * 0.5} style={styles.image} />
            <Text style={styles.title}>OTP Verification</Text>
            <Text style={styles.subtitle}>Enter the OTP sent to <Text style={styles.boldText}>{phoneNumber || ""}</Text></Text>

            <View style={{ paddingHorizontal: 40 }}>
                <OtpInput
                    numberOfDigits={4}
                    type="numeric"
                    secureTextEntry={false}
                    focusStickBlinkingDuration={500}
                    onFocus={() => console.log("Focused")}
                    onBlur={() => console.log("Blurred")}
                    onTextChange={(text) => console.log(text)}
                    onFilled={(text) => setOtp(text)}
                    textInputProps={{
                        acces1sibilityLabel: "One-Time Password",
                    }}
                    textProps={{
                        accessibilityRole: "text",
                        accessibilityLabel: "OTP digit",
                        allowFontScaling: false,
                    }}
                    theme={{
                        pinCodeTextStyle: styles.pinCodeText,
                        pinCodeContainerStyle: styles.pinCodeContainer,
                    }}

                />
            </View>

            <View style={styles.resendTextContainer}>
                <Text style={styles.resendText}>Didn’t receive the OTP?</Text>
                <TouchableOpacity onPress={() => console.log("Resent OTP!")}><Text style={styles.resendLink}>Resend OTP</Text></TouchableOpacity>
            </View>

            {/* <TouchableOpacity style={styles.button} onPress={() => console.log("OTP Submitted",otp)}>
                <Text style={{ color: "white", textAlign: "center" }}>Verify</Text>
            </TouchableOpacity> */}
            <View style={{ width: "100%", paddingHorizontal: 20 }}>
                <CustomButton
                    title="OTP Verify"
                    onPress={handleOtpVerification}
                    disabled={otp.length < 4} // Disable button if OTP is not complete
                />
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center',
        paddingTop: width * 0.2,
        backgroundColor: 'white',
        gap: 30,
        padding: 20,
    },
    image: {
        width: width * 0.5,
        height: width * 0.5,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 8,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#000',
    },
    otpContainer: {
        flexDirection: 'row',
        marginTop: 16,
    },
    otpInput: {
        borderBottomWidth: 2,
        borderColor: '#888',
        textAlign: 'center',
        fontSize: 18,
        width: 40,
        marginHorizontal: 5,
    },
    resendText: {
        fontSize: 16,
        color: '#888',
    },
    resendLink: {
        color: '#007bff',
        fontWeight: '600',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#007bff',
        paddingVertical: 10,
        width: '100%',
        borderRadius: 8,
    },
    pinCodeContainer: {
        padding: 5,
        borderRadius: 5,
        borderWidth: 1,
    },
    pinCodeText: {
        fontSize: 18
    },
    resendTextContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    }
});

export default OTPVerificationScreen;
