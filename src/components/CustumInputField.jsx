import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const CustomInput = ({
  label,
  value,
  onChangeText,
  editable = true,
  style,
  ...props
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          props.multiline && styles.multilineInput,
          !editable && styles.disabledInput,
          style,
        ]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        textAlignVertical={props.multiline ? 'top' : 'center'}
        {...props} // Spread the rest of the props here
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
  multilineInput: {
    height: 100,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
});

export default CustomInput;
