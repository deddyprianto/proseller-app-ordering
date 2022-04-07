import React, {useState, useRef} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';

import CountryPicker from '../components/react-native-country-picker-modal';
import appConfig from '../config/appConfig';

import colorConfig from '../config/colorConfig';

const styles = StyleSheet.create({
  viewOtpField: {
    width: '40%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInputOtp: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
});

const OTPField = () => {
  const ref = {
    otp1: useRef(),
    otp2: useRef(),
    otp3: useRef(),
    otp4: useRef(),
  };

  const renderTextInput = ({inputRef, autoFocus, onChangeText}) => {
    return (
      <View>
        <TextInput
          ref={inputRef}
          autoFocus={autoFocus}
          keyboardType="numeric"
          style={styles.textInputOtp}
          maxLength={1}
          onChangeText={onChangeText}
        />
      </View>
    );
  };

  const handleInputOtp = (event, index) => {
    const arrayLength = Array.from(Array(4)).length;

    if (index !== 0 && !event) {
      return ref[`otp${index - 1}`].focus();
    }

    if (arrayLength - 1 !== index && event) {
      return ref[`otp${index + 1}`].focus();
    }
  };

  const renderInputOtp = () => {
    const result = Array.from(Array(4)).map((_, index) => {
      return renderTextInput({
        autoFocus: index === 0,
        inputRef: r => {
          ref[`otp${index}`] = r;
        },
        onChangeText: value => {
          handleInputOtp(value.replace(/[^0-9]/g, ''), index);
        },
      });
    });
    return result;
  };

  return <View style={styles.viewOtpField}>{renderInputOtp()}</View>;
};

export default OTPField;
