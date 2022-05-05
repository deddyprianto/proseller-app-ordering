import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';

import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import appConfig from '../config/appConfig';
import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';

import FieldTextInput from '../components/fieldTextInput';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  image: {
    width: 150,
    height: 40,
    marginHorizontal: 20,
  },
  textCreateNewAccount: {
    color: colorConfig.primaryColor,
    fontSize: 20,
  },
  touchableNext: {
    height: 40,
    width: '100%',
    backgroundColor: colorConfig.primaryColor,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchableNextDisabled: {
    height: 40,
    width: '100%',
    backgroundColor: '#B7B7B7',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textNext: {color: 'white'},
  textChangeMethod: {
    width: '100%',
    textAlign: 'center',
    color: colorConfig.primaryColor,
    textDecorationLine: 'underline',
  },
});

const Register = () => {
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [registerMethod, setRegisterMethod] = useState('email');

  useEffect(() => {
    setCountryCode(awsConfig.phoneNumberCode);
  }, []);

  const renderImages = () => {
    return (
      <Image
        style={styles.image}
        resizeMode="stretch"
        source={appConfig.funtoastIcon}
      />
    );
  };

  const renderPhoneNumberRegisterInput = () => {
    return (
      <FieldTextInput
        type="phone"
        label="Enter mobile number to begin :"
        value={phoneNumber}
        onChangeCountryCode={value => {
          setCountryCode(value);
        }}
        onChange={value => {
          setPhoneNumber(value);
        }}
      />
    );
  };

  const renderEmailRegisterInput = () => {
    return (
      <FieldTextInput
        label="Enter email to begin :"
        value={email}
        onChange={value => {
          setEmail(value);
        }}
      />
    );
  };

  const renderRegisterMethodInput = () => {
    if (registerMethod === 'email') {
      return renderEmailRegisterInput();
    } else {
      return renderPhoneNumberRegisterInput();
    }
  };

  const renderButtonNext = () => {
    let active = false;
    let value = '';

    if (registerMethod === 'email') {
      active = registerMethod === 'email' && email;
      value = email;
    } else {
      active = registerMethod === 'phoneNumber' && phoneNumber;
      value = countryCode + phoneNumber;
    }

    return (
      <TouchableOpacity
        disabled={!active}
        style={active ? styles.touchableNext : styles.touchableNextDisabled}
        onPress={() => {
          Actions.registerForm({registerMethod, inputValue: value});
        }}>
        <Text style={styles.textNext}>Next</Text>
      </TouchableOpacity>
    );
  };

  const handleChangeRegisterMethod = () => {
    if (registerMethod === 'email') {
      setRegisterMethod('phoneNumber');
    } else {
      setRegisterMethod('email');
    }
  };

  const renderTextChangeMethod = () => {
    const text =
      registerMethod === 'email'
        ? 'Use Mobile Number to Create Account'
        : 'Use Email Address to Create Account';

    return (
      <TouchableOpacity
        onPress={() => {
          handleChangeRegisterMethod();
        }}>
        <Text style={styles.textChangeMethod}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginTop: '25%'}} />
      {renderImages()}
      <View style={{marginTop: '10%'}} />
      <Text style={styles.textCreateNewAccount}>Create a new account</Text>
      <View style={{marginTop: '30%'}} />
      {renderRegisterMethodInput()}
      <View style={{marginTop: '10%'}} />
      {renderButtonNext()}
      <View style={{marginTop: '15%'}} />
      {renderTextChangeMethod()}
    </SafeAreaView>
  );
};

export default Register;
