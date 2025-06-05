import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';
import {FONTFAMILY} from '../theme/theme';

const CustomInput = ({
  label,
  value,
  onChangeText,
  editable = true,
  style,
  containerStyle,
  ...props
}) => {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {/* <Text style={styles.label}>{label}</Text> */}
      <TextInput
        // style={[
        //   styles.input,
        //   props.multiline && styles.multilineInput,
        //   !editable && styles.disabledInput,
        //   style,
        // ]}
        style={{
          fontSize: 13, // affects both placeholder and user input
          color: 'black',
          height: 35,
          fontFamily: FONTFAMILY.regular,
        }}
        mode="outlined"
        label={label}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        textAlignVertical={props.multiline ? 'top' : 'center'}
        outlineColor="#999999" // Gray border when not focused
        outlineStyle={{borderWidth: 1}}
        activeOutlineColor="#000000" // Blue border on focus
        theme={{
          fonts: {
            labelMedium: {
              fontFamily: FONTFAMILY.regular,
              letterSpacing: 0.5,
              fontWeight: '400',
              lineHeight: 20,
              fontSize: 17,
            },
            bodyLarge: {
              fontFamily: FONTFAMILY.regular,
              letterSpacing: 0.5,
              fontWeight: '400',
              lineHeight: 24,
              fontSize: 16,
            },
          },
        }}
        {...props} // Spread the rest of the props here
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 10,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#555',
    fontFamily: FONTFAMILY.regular,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 14,
    marginTop: 4,
    backgroundColor: '#fff',
    fontFamily: FONTFAMILY.regular,
  },
  multilineInput: {
    height: 100,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
});

export default CustomInput;
