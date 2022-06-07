import React, {useEffect, useState} from 'react';
import {Actions} from 'react-native-router-flux';

import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import appConfig from '../config/appConfig';
import colorConfig from '../config/colorConfig';
import awsConfig from '../config/awsConfig';

import FieldTextInput from '../components/fieldTextInput';
import FieldPhoneNumberInput from '../components/fieldPhoneNumberInput';
import {ScrollView} from 'react-navigation';
import {useDispatch} from 'react-redux';
import {checkAccountExist} from '../actions/auth.actions';
import {showSnackbar} from '../actions/setting.action';
import LoadingScreen from '../components/loadingScreen';

const HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
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
  const dispatch = useDispatch();
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [registerMethod, setRegisterMethod] = useState('email');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCountryCode(awsConfig.phoneNumberCode);
  }, []);

  const handleCheckAccount = async () => {
    let payload = {};
    let value = '';

    if (registerMethod === 'email') {
      payload.email = email;
      value = email;
    } else {
      payload.phoneNumber = countryCode + phoneNumber;
      value = countryCode + phoneNumber;
    }

    setIsLoading(true);
    const response = await dispatch(checkAccountExist(payload));

    if (response?.status) {
      const message =
        registerMethod === 'email'
          ? 'Email already exist'
          : 'Mobile Number already exist';

      dispatch(
        showSnackbar({
          message,
        }),
      );
    } else {
      Actions.registerForm({registerMethod, inputValue: value});
    }

    setIsLoading(false);
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

  const renderPhoneNumberRegisterInput = () => {
    return (
      <FieldPhoneNumberInput
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
        placeholder="Enter email to begin"
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
    const active = phoneNumber || email;

    return (
      <TouchableOpacity
        disabled={!active}
        style={active ? styles.touchableNext : styles.touchableNextDisabled}
        onPress={() => {
          handleCheckAccount();
        }}>
        <Text style={styles.textNext}>Next</Text>
      </TouchableOpacity>
    );
  };

  const handleChangeRegisterMethod = () => {
    setEmail('');
    setPhoneNumber('');
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
    <ScrollView>
      <LoadingScreen loading={isLoading} />
      <View style={styles.container}>
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
      </View>
    </ScrollView>
  );
};

export default Register;
