import React, {useState, useRef} from 'react';
import {Actions} from 'react-native-router-flux';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import appConfig from '../config/appConfig';

import colorConfig from '../config/colorConfig';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 45,
  },
  image: {
    width: 150,
    height: 40,
    marginHorizontal: 20,
  },
  touchableNext: {
    height: 40,
    width: '100%',
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHeader: {
    color: colorConfig.primaryColor,
    fontSize: 20,
  },
  textNext: {color: 'white'},
  textVerify: {
    width: '80%',
    textAlign: 'center',
  },
  textInputOtp: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  viewInputOtp: {
    width: '70%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textSendOtp: {
    width: '100%',
    textAlign: 'center',
    color: colorConfig.primaryColor,
    textDecorationLine: 'underline',
  },
  textBold: {fontWeight: 'bold'},
});

const OTP = ({isLogin, method, methodValue}) => {
  const ref = {
    otp1: useRef(),
    otp2: useRef(),
    otp3: useRef(),
    otp4: useRef(),
  };

  const renderImages = () => {
    return (
      <Image
        style={styles.image}
        resizeMode="stretch"
        source={appConfig.funtoastIcon}
      />
    );
  };

  const renderTextHeader = () => {
    let text = '';
    if (isLogin) {
      text = method === 'email' ? 'Email Sign In' : 'Mobile Sign In';
    } else {
      text = method === 'email' ? 'Email Register' : 'Mobile Register';
    }

    return <Text style={styles.textHeader}>{text}</Text>;
  };

  const renderButtonNext = () => {
    return (
      <TouchableOpacity
        style={styles.touchableNext}
        onPress={() => {
          Actions.pageIndex();
        }}>
        <Text style={styles.textNext}>Next</Text>
      </TouchableOpacity>
    );
  };

  const renderTextInput = ({inputRef, autoFocus, onChangeText}) => {
    return (
      <TextInput
        ref={inputRef}
        autoFocus={autoFocus}
        keyboardType="numeric"
        style={styles.textInputOtp}
        maxLength={1}
        onChangeText={onChangeText}
      />
    );
  };

  const handleInputOtp = (value, index) => {
    const arrayLength = Array.from(Array(4)).length;

    if (index !== 0 && !value) {
      return ref[`otp${index - 1}`].focus();
    }

    if (arrayLength - 1 !== index && value) {
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

    return <View style={styles.viewInputOtp}>{result}</View>;
  };

  const renderSendOTP = () => {
    return (
      <TouchableOpacity>
        <Text style={styles.textSendOtp}>Resend OTP</Text>
      </TouchableOpacity>
    );
  };

  const renderTextVerify = () => {
    const text = method === 'email' ? 'email' : 'number';

    return (
      <Text style={styles.textVerify}>
        We sent an OTP code to verify your {text} at
        <Text style={styles.textBold}> {methodValue}</Text>
      </Text>
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{marginTop: '25%'}} />
        {renderImages()}
        <View style={{marginTop: '15%'}} />
        {renderTextHeader()}
        <View style={{marginTop: '20%'}} />
        {renderTextVerify()}
        <View style={{marginTop: '15%'}} />
        {renderInputOtp()}
        <View style={{marginTop: '15%'}} />
        {renderSendOTP()}
        <View style={{marginTop: '10%'}} />
        {renderButtonNext()}
      </View>
    </ScrollView>
  );
};

export default OTP;
