import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const CustomInput = ({ label, value, onChangeText, editable = true, style }) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.input, !editable && styles.disabledInput, style]}
                value={value}
                onChangeText={onChangeText}
                editable={editable}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        fontSize: 14,
        marginTop: 4,
        backgroundColor: '#fff',
    },
    disabledInput: {
        backgroundColor: '#f0f0f0', // Light gray background color for disabled inputs
    },
});

export default CustomInput;
